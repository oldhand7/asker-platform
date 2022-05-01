import { withUserGuard } from 'libs/iron-session';
import { sessionOptions } from 'libs/iron-session';
import { getApp } from 'libs/firebase-admin';
import { validate } from 'libs/validator';
import { createApiHandler as getHandler } from 'libs/nc';
import { withIronSessionApiRoute } from 'iron-session/next';
import { getAuth } from 'firebase-admin/auth'

const app = getApp();
const handler = getHandler();

handler.put(async (req, res) => {
  const { query, body } = req;

  const rules = {
    email: 'required|email',
    uid: 'required'
  }

  if (body.password) {
    rules.password =  'required|min:6'
  }

  const errors = validate(req.body, rules)

  if (errors) {
    res.status(422).json({
      message: "User invalid.",
      details: errors
    })

    return;
  }

  const user = await getAuth(app)
    .getUser(body.uid)

  const companyAdmin = user.customClaims['companyId'] == req.session.user.companyId && req.session.user.type == 'admin';

  if (!companyAdmin && !req.session.user.superadmin) {
    res.status(403).json({
      message: "You have no permission for this action"
    })
  }

  const newUser = {
    email: body.email
  }

  if (body.password) {
    newUser.password = body.password;
  }

  try {
    const user = await getAuth(app)
      .updateUser(body.uid, newUser)

    res.status(200).end()
  } catch (error) {
    res.status(500).json({
      message: "Creating user failed.",
      details: error.message
    })
  }
})

export default withIronSessionApiRoute(withUserGuard(handler, false), sessionOptions);
