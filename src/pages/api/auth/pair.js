import { createApiHandler } from 'libs/nc';
import { ironSessionOptions } from 'libs/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { validate } from 'libs/validator';
import { getApp } from 'libs/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getUser} from 'libs/firestore';

const handler = createApiHandler()

handler.post(async (req, res) => {
    const rules = {
        uid: 'required',
        idToken: 'required'
    }

    const errors = validate(req.body, rules)

    if (errors) {
        res.status(422).json({
            message: "Form invalid.",
            details: errors
        });

        return;
    }

    const decodedToken = await getAuth(getApp()).verifyIdToken(req.body.idToken)

    if (decodedToken.uid != req.body.uid) {
      res.status(401).end()

      return;
    }

    try {
      const db = getFirestore(getApp())

      const user = await getUser(db, req.body.uid)

      req.session.user = {
          uid: req.body.uid,
          superadmin: !!user.superadmin
      }

      await req.session.save()

      res.status(200).end()
    } catch (error) {
        res.status(404).json({
            message: "User does not exist or password invalid.",
            details: error.message
        });

        return;
    }
})

export default withIronSessionApiRoute(handler, ironSessionOptions);
