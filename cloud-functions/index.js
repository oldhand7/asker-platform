const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
  getAuth
} = require('firebase-admin/auth')

admin.initializeApp()

admin.firestore().settings({
  ignoreUndefinedProperties: true
});

const defaultUser = {
  name: '',
  email: '',
  phone: '',
  superadmin: false,
  companyId: '',
  type: 'admin' // admin|hr
}

const updateFirebaseUserClaimsFromProfile = (uid, platformUser) => {
  const claims = {
    superadmin: !!platformUser.superadmin,
    companyId: platformUser.companyId,
    type: platformUser.type
  }

  return getAuth().setCustomUserClaims(uid, claims)
}

exports.stampCollections = functions.firestore.document('{collectionName}/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    if (!data.id) {
      return snap.ref.set({
        ...data,
        id: snap.id
      })
    }

    return null
});

exports.firebaseAccountCreate = functions.auth.user().onCreate(async (user) => {
  const snap = await admin.firestore()
    .collection('users')
    .doc(user.uid)
    .get()

    //Platform users are created with displayName=email
   if (user.displayName !== user.email) {
     await admin.firestore()
       .collection('users')
       .doc(user.uid)
       .create({
         ...defaultUser,
         email: user.email,
         name: user.email
       })
   }
});

exports.interviewCreate = functions.firestore.document('interviews/{docId}')
  .onCreate(async (snap, context) => {
    const interview = snap.data();

    try {
      await admin.firestore()
        .collection('projects')
        .doc(interview.projectId)
        .update({
          interviews: admin.firestore.FieldValue.arrayUnion({
            id: snap.id,
            candidate: interview.candidate,
            status: interview.status
          })
        })
    } catch (error) {
      console.log(error)

      return null;
    }
});

exports.updateInterview = functions.firestore.document('interviews/{docId}')
  .onUpdate(async (change, context) => {
    const interview = change.after.data();

    try {
      const interviews = await admin.firestore()
        .collection('interviews')
        .select('id', 'candidate', 'status')
        .where('projectId', '==', interview.projectId)
        .get()
        .then(snap => {
          const interviews = []

          snap.forEach((interview) => {
            interviews.push(interview.data())
          });

          return interviews;
        })

      await admin.firestore()
        .collection('projects')
        .doc(interview.projectId)
        .update({ interviews })
    } catch (error) {
      console.log(error)

      return null;
    }
});

exports.platformAccountCreate = functions.firestore.document('users/{docId}')
  .onCreate(async (snap, context) => {
    const platformUser = snap.data();

    try {
      await updateFirebaseUserClaimsFromProfile(snap.id, platformUser)
    } catch (error) {
      console.log(error)

      return null;
    }
  });

exports.platformAccountUpdate = functions.firestore
  .document('users/{docId}')
  .onUpdate(async (change, context) => {
    const platformUser = change.after.data();

    try {
      await updateFirebaseUserClaimsFromProfile(platformUser.id, platformUser)
    } catch (error) {
      console.log(error)

      return null;
    }
  });

exports.platformAccountDelete = functions.firestore
  .document('users/{docId}')
  .onDelete(async (snap, context) => {
    try {
      const user = await getAuth().getUser(snap.id)

      if (user) {
        await getAuth()
          .deleteUsers([snap.id])
      }
    } catch (error) {}

    return snap
  });

exports.firebaseAccountDelete = functions.auth.user().onDelete(async (user) => {
    const snap = await admin.firestore()
      .collection('users')
      .doc(user.uid)
      .get()

    if (snap.exists) {
      await admin.firestore()
        .collection('users')
        .doc(user.uid)
        .delete()
    }
  });
