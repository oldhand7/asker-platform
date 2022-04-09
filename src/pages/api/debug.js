import { createApiHandler } from 'libs/nc';
import { sessionOptions } from 'libs/iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';

const handler = createApiHandler()

handler.get(async (req, res) => {
  console.log(process.env);

  res.status(200).json({
    session: req.session,
    cookies: req.cookies
  });
})

export default withIronSessionApiRoute(handler, sessionOptions);
