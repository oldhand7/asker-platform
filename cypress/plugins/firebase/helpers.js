const { initializeApp, getApps, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require('firebase-admin/auth');
const { credential } = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, './../../../.env.testing'),
  override: true
})

const firebaseServiceCreds = require(
  `./../../../firebase-service-creds-testing.json`
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
    .listUsers(30)
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

const createRootCompany = async () => {
  const docRef = db.collection('companies').doc('asker')

  await docRef.set({
    name: 'Asker'
  })

  return docRef.id;
}

const createUser = async (name, email, password, companyId = null, type = 'admin', superadmin = false) => {
  const user = await getAuth().createUser({
    email,
    displayName: email, //avoid loop in functions
    password
  })

  const docRef = db.collection('users').doc(user.uid)

   await docRef.set({
    name,
    email,
    superadmin,
    type,
    companyId,
    createdAt: 0,
    updatedAt: 0
  })

  return docRef.id
}

const createProject = async (details) => {
  const docRef = db.collection('projects').doc()

   await docRef.set(details)

  return docRef.id
}

const createQuestion = async (details) => {
  const docRef = db.collection('questions').doc()

   await docRef.set(details)

  return docRef.id
}

const createInterview = async (details) => {
  const docRef = db.collection('interviews').doc()

  await docRef.set(details)

  return docRef.id
}

async function deleteCollection(collectionPath, batchSize = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(query, resolve) {
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
    deleteQueryBatch(query, resolve);
  });
}

module.exports = {
  removeAllFirebaseUsers,
  createCompany,
  createRootCompany,
  createUser,
  createProject,
  createQuestion,
  createInterview,
  deleteCollection,
  deleteQueryBatch
}
