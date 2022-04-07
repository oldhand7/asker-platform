const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
  getAuth
} = require('firebase-admin/auth')

admin.initializeApp({
  databaseURL: 'https://asker-3e929.firebaseio.com'
})

admin.firestore().settings({
  ignoreUndefinedProperties: true
});

const defaultUser = {
  superadmin: false,
  type: 'admin' // admin|hr
}

const updateFirebaseUserFromProfile = async (uid, platformUser) => {
  const {
    images,
    profile
  } = platformUser;

  const data = {
    email: profile.email,
    emailVerified: !!profile.emailVerified,
    phoneNumber: profile.phoneNumber ? profile.phoneNumber : undefined,
    displayName: profile.displayName,
    photoURL: images && images.length ? images[0].src : undefined,
    disabled: !!profile.disabled
  }

  const claims = {
    superadmin: !!platformUser.superadmin,
    companyId: platformUser.companyId
  }

  await getAuth().setCustomUserClaims(uid, claims)

  return getAuth().updateUser(uid, data)
}

exports.firebaseAccountCreate = functions.auth.user().onCreate(async user => {
  const snap = await admin.firestore()
    .collection('users')
    .doc(user.uid)
    .get()

  if (!snap.exists) {
    await admin.firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        ...defaultUser,
        lastTouch: 'firebaseAccountCreate',
        profile: JSON.parse(JSON.stringify(user))
      })
  }
});

exports.platformAccountCreate = functions.firestore.document('users/{docId}')
  .onCreate(async (snap, context) => {
    const platformUser = snap.data();

    if (platformUser.lastTouch == 'firebaseAccountCreate') {
      return null
    }

    try {
      const user = await updateFirebaseUserFromProfile(snap.id, platformUser)

      return snap.ref.set({
        ...defaultUser,
        ...platformUser,
        lastTouch: 'platformAccountCreate',
        profile: JSON.parse(JSON.stringify(user))
      })
    } catch (error) {
      console.log(error)

      return null;
    }
  });

exports.platformAccountUpdate = functions.firestore
  .document('users/{docId}')
  .onUpdate(async (change, context) => {
    const platformUserBefore = change.before.data();

    if (platformUserBefore.lastTouch == 'platformAccountCreate') {
      return null;
    }

    const platformUser = change.after.data();

    if (platformUser.lastTouch == 'platformAccountCreate') {
      return change.after.ref.set({
        lastTouch: 'platformAccountUpdate'
      }, {
        merge: true
      });
    }

    try {
      const user = await updateFirebaseUserFromProfile(change.after.id, platformUser)

      return change.after.ref.set({
        ...platformUser,
        companyName: await getCompanyNameById(change.after.companyId),
        lastTouch: 'platformAccountUpdate',
        profile: JSON.parse(JSON.stringify(user))
      }, {
        merge: true
      });
    } catch (error) {
      console.log(error)

      return null;
    }
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
