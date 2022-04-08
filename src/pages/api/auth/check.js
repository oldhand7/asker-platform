import { createApiHandler } from 'libs/nc';
import { sessionOptions } from 'libs/iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';

const handler = createApiHandler()

handler.get(async (req, res) => {
  if (!req.session.user) {
    res.status(403).end();

    return;
  }

  res.status(200).json(req.session.user);
})

export default withIronSessionApiRoute(handler, sessionOptions);
