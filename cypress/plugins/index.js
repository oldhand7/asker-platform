const { initializeApp, getApps, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require('firebase-admin/auth');
const { credential } = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, './../../.env.testing'),
  override: true
})

const firebaseServiceCreds = require(
  `./../../firebase-service-creds-testing.json`
);

const app = initializeApp({
    credential: credential.cert({
      ...firebaseServiceCreds,
      private_key: process.env.FIREBASE_SERVICE_KEY.replace(/\\n/g, '\n')
    })
});


const db = getFirestore(app)

const removeAllFirebaseUsers = () => {
  return getAuth()
    .listUsers(3)
    .then(async ({ users }) => {
      const tasks = []

      users.forEach((user) => {
        tasks.push(getAuth().deleteUser(user.uid))
      });

      return Promise.all(tasks)
    })
};

const createCompany = async (name) => {
  const docRef = db.collection('companies').doc()

  await docRef.set({
    name
  })

  return docRef.id;
}

const createUser = async (displayName, email, password, companyId = null, type = 'admin', superadmin = false) => {
  const user = await getAuth().createUser({
    email,
    password,
    displayName
  })

  const docRef = db.collection('users').doc(user.uid)

  return docRef.set({
    superadmin,
    type,
    companyId
  })
}

async function deleteCollection(db, collectionPath, batchSize = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}


/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('before:run', async (details) => {
      await removeAllFirebaseUsers()
      await deleteCollection(db, 'companies');
      await createUser('John Powers', 'admin@askertech.com', 'test123', '', 'admin', true)
      const companyId = await createCompany('Doe Paper Company')
      await createUser('Joe Doe', 'joe.doe@example.com', 'test123', companyId, 'admin', false)
      await createUser('Jane Doe', 'jane.doe@example.com', 'test123', companyId, 'hr', false)
  })

  on('before:spec', async (spec) => {
    //
  })
}
