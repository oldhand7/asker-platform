import { FirebaseDataProvider } from 'react-admin-firebase';
import { createFirebaseUser, updateFirebaseUserEmailAndPassword } from 'libs/api'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { connectFirestoreEmulator } from 'firebase/firestore'

const CustomDataProvider = (config, options) => {
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

      //To keep passwords safe dedicating user creation for backend-api.
      if (resource == 'users') {
        return createFirebaseUser(params.data.email, params.data.password)
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
      if (resource == 'users' && params.data.password || (params.previousData.email != params.data.email)) {
        return updateFirebaseUserEmailAndPassword(params.data.id, params.data.email, params.data.password)
          .then(() => {
            delete params.data.password

            return dataProvider.update(resource, params)
          })
      }

      return dataProvider.update(resource, params)
    },
    getList: async (resource, params) => {
      const { filter } = params;


      if (typeof filter.companyId === "object" && filter.companyId.length) {

        const uniqueCompanyId = filter.companyId.filter((v, i, a) => a.indexOf(v) === i)

        const data = await Promise.all([
          ...uniqueCompanyId.map(companyId => dataProvider.getList(resource, {
            ...params,
            filter: {
              ...params.filter,
              companyId
            }
          }))
        ])  

        const finalData = data.reduce((data, d) => [...data, ...d.data], []).map(d => {
          if (d.companyId == 'asker') {
            d.name.en = d.name.en + ' (A)'
          }

          return d;
        })

        finalData.sort((a, b) => {
          if (a.name.en < b.name.en) {
            return 1;
          }
          if (a.name.en > b.name.en) {
            return -1;
          }
          return 0;
        })

        const result = {
          data: finalData,
          total: data.reduce((sum, d) => sum + d.total, 0)
        }

        return Promise.resolve(result)
      }

      return dataProvider.getList(resource, params);
    }
  }
}

export default CustomDataProvider;
