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
    password: 'required|min:6',
    uid: 'required'
  }

  const errors = validate(req.body, rules)

  if (errors) {
    res.status(422).json({
      message: "User invalid.",
      details: errors
    })

    return;
  }

  try {
    const user = await getAuth(app)
      .updateUser(body.uid, {
        email: body.email,
        password: body.password
      })

    res.status(200).end()
  } catch (error) {
    res.status(500).json({
      message: "Creating user failed.",
      details: error.message
    })
  }
})

export default withIronSessionApiRoute(withUserGuard(handler, true), sessionOptions);
