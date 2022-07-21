import { createApiHandler } from 'libs/nc';
import { sessionOptions } from 'libs/iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { validate } from 'libs/validator';
import { getApp } from 'libs/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getSingleDocument} from 'libs/firestore-admin';

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

    const claims = await getAuth(getApp()).verifyIdToken(req.body.idToken)

    if (claims.uid != req.body.uid) {
      res.status(401).end()

      return;
    }

    try {
      const user = await getSingleDocument('users', claims.uid);

      if (!user) {
        res.status(404).json({
            message: "User not found."
        });

        return;
      }

      if (user.disabled) {
        res.status(404).json({
          message: "Your account has been deactivated. Please reach out to info@askertech.com if you want to reactivate your account."
        });

        return;
      }

      req.session.user = {
        id: claims.uid,
        companyId: claims.companyId,
        superadmin: claims.superadmin,
        type: claims.type,
        locale: user.locale || 'en'
      }

      await req.session.save()

      delete user.updatedBy

      res.status(200).json(
        JSON.parse(JSON.stringify(user))
      )
    } catch (error) {
        res.status(404).json({
            message: "User does not exist or password invalid.",
            details: error.message
        });

        return;
    }
})

export default withIronSessionApiRoute(handler, sessionOptions);
