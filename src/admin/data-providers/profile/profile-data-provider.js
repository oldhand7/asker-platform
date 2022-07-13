import { FirebaseDataProvider } from 'react-admin-firebase';
import { createFirebaseUser, updateFirebaseUserEmailAndPassword } from 'libs/api'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { connectFirestoreEmulator } from 'firebase/firestore'

const ProfileDataProvider = (config, options) => {
  const firebaseAuthOptions = options || {}

  if (process.env['NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST']) {
    firebase.initializeApp(config)

    firebase.firestore().settings({ experimentalForceLongPolling: true });

    const db = firebase.firestore()
    const parts = process.env['NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST'].split(':');
    connectFirestoreEmulator(db, ...parts);

    firebaseAuthOptions.app = db.app;
  }

  const dataProvider = FirebaseDataProvider(config, firebaseAuthOptions);

  return {
    ...dataProvider,
    create: (resource, params) => {
      if (resource == 'users') {
        return createFirebaseUser(params.data.email, params.data.password)
                  .then(({ uid }) => {
                    delete params.data.password

                    params.data.id = uid;

                    return dataProvider.create(resource, params);
                  })
      }

      return dataProvider.create(resource, params)
    },
    update: (resource, params) => {
      //To keep passwords safe dedicating password reset for backend-api.
      if (resource == 'users' && params.data.password || (params.previousData.email != params.data.email)) {
        return updateFirebaseUserEmailAndPassword(params.data.id, params.data.email, params.data.password)
          .then(() => {
            delete params.data.password

            return dataProvider.update(resource, params)
          })
      }

      return dataProvider.update(resource, params)
    }
  }
}

export default ProfileDataProvider;
