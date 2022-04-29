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
    .listUsers(20)
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
    companyId
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

const beforeRun = async () => {
  await removeAllFirebaseUsers()
  await deleteCollection(db, 'companies');
  await deleteCollection(db, 'projects');
  await deleteCollection(db, 'interviews');
  await deleteCollection(db, 'questions');

  //Creates superadmin
  await createUser('John Powers', 'admin@askertech.com', 'test123', '', 'admin', true)

  //User 1
  const companyId1 = await createCompany('Doe Paper Company')

  await createUser('Joe Doe', 'joe.doe@example.com', 'test123', companyId1, 'admin', false)
  await createUser('Jane Doe', 'jane.doe@example.com', 'test123', companyId1, 'hr', false)

  //User 2
  const companyId2 = await createCompany('Philips')

  const userId2Joe  = await createUser('Joe Philips', 'joe.philips@example.com', 'test123', companyId2, 'admin', false)
  const userId2Jane = await createUser('Jane Philips', 'jane.philips@example.com', 'test123', companyId2, 'hr', false)

  //User 3
  const companyId3 = await createCompany('Smith & Co')

  const userId3Joe  = await createUser('Joe Smith', 'joe.smith@example.com', 'test123', companyId3, 'admin', false)
  const userId3Jane = await createUser('Jane Smith', 'jane.smith@example.com', 'test123', companyId3, 'hr', false)

  //User 4
  const companyId4 = await createCompany('Brown & Co')

  const userId4Joe  = await createUser('Joe Brown', 'joe.brown@example.com', 'test123', companyId4, 'admin', false)
  const userId4Jane = await createUser('Jane Brown', 'jane.brown@example.com', 'test123', companyId4, 'hr', false)

  //User 4
  const companyId5 = await createCompany('Davis & Co')

  const userId5Joe  = await createUser('Joe Davis', 'joe.davis@example.com', 'test123', companyId5, 'admin', false)
  const userId5Jane = await createUser('Jane Davis', 'jane.davis@example.com', 'test123', companyId5, 'hr', false)

  await createQuestion({
    name: 'CQ1',
    companyId: companyId2,
    criteria: {
      name: 'CA',
      type: 'competency'
    }
  })

  await createQuestion({
    name: 'CQ2',
    companyId: companyId2,
    criteria: {
      name: 'CB',
      type: 'competency'
    }
  })

  await createQuestion({
    name: 'CQ3',
    companyId: companyId2,
    criteria: {
      name: 'CC',
      type: 'competency'
    }
  })

  //allow some time to pass for propagation of claims
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const projectId = await createProject({
    companyId: companyId2,
    userId: userId2Joe,
    createdAt: 0,
    updatedAt: 0,
    name: 'Philips Demo Project',
    stages: [
      { id: 'introduction', name: 'Introduction', type: 'other' },
      { id: 'questions', name: 'Questions', type: 'other' },
      { id: 'summary', name: 'Summary', type: 'other' }
    ],
    config: {
      introduction: {
        text: 'This is Philips introduction.'
      }
    },
    interviewers: [
      { id: userId2Jane, name: 'Jane Philips'}
    ],
    template: {
      id: 'philips-engineer',
      name: 'Philips Engineer'
    },
    interviews: []
  })

  await createInterview({
    companyId: companyId2,
    userId: userId2Joe,
    projectId: projectId,
    candidate: { id: 'ca', name: 'Candidate A' },
    score: 40,
    status: 'completed',
    evaluations: [], //@TODO
    createdAt: 1,
    updatedAt: 0
  })

  await createInterview({
    companyId: companyId2,
    userId: userId2Joe,
    projectId: projectId,
    candidate: { id: 'cb', name: 'Candidate B' },
    status: 'awaiting',
    evaluations: [], //@TODO
    createdAt: 2,
    updatedAt: 0,
  })
}

module.exports = {
  beforeRun
}
