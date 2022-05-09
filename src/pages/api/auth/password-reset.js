import { createApiHandler } from 'libs/nc';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'libs/iron-session';
import { getApp } from 'libs/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { sendCustomPasswordResetEmail } from 'libs/email';

const handler = createApiHandler()

const app = getApp();

handler.post(async (req, res) => {
  try {
    await getAuth(app)
      .generatePasswordResetLink(req.body.email)
      .then((link) => sendCustomPasswordResetEmail(req.body.email, link))
  } catch (error) {
    //
  }

  res.status(200).end()
})

export default handler;
