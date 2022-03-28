import { createApiHandler } from 'libs/nc';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironSessionOptions } from 'libs/session';

const handler = createApiHandler()

handler.get(async (req, res) => {
    await req.session.destroy()

    res.status(200).end()
})

export default withIronSessionApiRoute(handler, ironSessionOptions);
