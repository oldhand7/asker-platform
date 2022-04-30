import { createApiHandler as getHandler } from 'libs/nc';
import { withUserGuard } from 'libs/iron-session';
import { sessionOptions } from 'libs/iron-session';
import { getApp } from 'libs/firebase-admin';
import { validate } from 'libs/validator';
import { withIronSessionApiRoute } from 'iron-session/next';
import { getAuth } from 'firebase-admin/auth'

const app = getApp();
const handler = getHandler();

handler.post(async (req, res) => {
  const { body } = req;

  const rules = {
    email: 'required|email',
    password: 'required|min:6'
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
      .createUser({
        email: body.email,
        displayName: body.email, //this will help avoid update loops later
        password: body.password
      })

    res.status(200).json({
      uid: user.uid
    })
  } catch (error) {
    res.status(500).json({
      message: "Creating user failed.",
      details: error.message
    })
  }
})

handler.put((req, res) => {
  const { query } = req;

  if (query.slug.length != 1) {
    res.status(404).end()
  }

  createResource(req, res);
})

export default withIronSessionApiRoute(withUserGuard(handler, false), sessionOptions);
