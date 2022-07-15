import { createApiHandler as getHandler } from 'libs/nc';
import { withUserGuard, sessionOptions } from 'libs/iron-session';
import { getApp } from 'libs/firebase-admin';
import { validate } from 'libs/validator';
import { withIronSessionApiRoute } from 'iron-session/next';
import { getAuth } from 'firebase-admin/auth'
import { sendInvitationEmail } from 'libs/email';
import { getSingleDocument } from 'libs/firestore-admin';

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

  let user;

  try {
    user = await getAuth(app)
      .createUser({
        email: body.email,
        displayName: body.email, //this will help avoid update loops later
        password: body.password
      })
  } catch (error) {
    res.status(500).json({
      message: "Creating user failed",
      details: error.message
    })

    return;
  }

  if (!user) {
    res.status(500).json({
      message: "Creating user failed"
    })

    return;
  }

  try {
    const company = await getSingleDocument(
      'companies',
      req.session.user.companyId || ' '
    )

    await sendInvitationEmail(body.email, body.password, company)
  } catch (error) {
    console.log(error.message)
  }

  res.status(200).json({
    uid: user.uid
  })
})

handler.put((req, res) => {
  const { query } = req;

  if (query.slug.length != 1) {
    res.status(404).end()
  }

  createResource(req, res);
})

export default withIronSessionApiRoute(withUserGuard(handler, false), sessionOptions);
