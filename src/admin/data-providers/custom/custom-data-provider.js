import { FirebaseDataProvider } from 'react-admin-firebase';

import { createFirebaseUser, updateFirebaseUserEmailAndPassword } from 'libs/api'

const CustomDataProvider = (config, options) => {
  const dataProvider = FirebaseDataProvider(config, options);

  return {
    ...dataProvider,
    create: (resource, params) => {

      //To keep passwords safe dedicating user creation for backend-api.
      if (resource == 'users') {
        return createFirebaseUser(params.data.profile.email, params.data.password)
                  .then(({ uid }) => {
                    delete params.data.password

                    params.data.id = uid;

                    return dataProvider.create(resource, params)
                  })
      }

      return dataProvider.create(resource, params)
    },
    update: (resource, params) => {

      //To keep passwords safe dedicating password reset for backend-api.
      if (resource == 'users' && params.data.password) {
        return updateFirebaseUserEmailAndPassword(params.data.id, params.data.profile.email, params.data.password)
          .then(() => {
            delete params.data.password

            return dataProvider.update(resource, params)
          })
      }

      return dataProvider.update(resource, params)
    }
  }
}

export default CustomDataProvider;
