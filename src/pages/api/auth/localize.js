import { createApiHandler } from 'libs/nc';
import { sessionOptions } from 'libs/iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { saveCollectionDocument } from 'libs/firestore-admin';

const handler = createApiHandler()

const validLocales = ['en', 'se'];

handler.post(async (req, res) => {
  const { user } = req.session;

  if (!user) {
    res.status(403).end();

    return;
  }

  const { locale } = req.body;

  if (!locale || validLocales.indexOf(locale) == -1) {
    res.status(422).json({
      message: 'Invalid locale'
    })

    return;
  }

  await saveCollectionDocument('users', { id: user.id, locale })

  const newUser = {
    ...user,
    locale
  }

  req.session.user = newUser;

  await req.session.save()

  res.status(200).json(newUser);
})

export default withIronSessionApiRoute(handler, sessionOptions);
