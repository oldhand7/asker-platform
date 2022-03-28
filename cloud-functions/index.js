const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
  databaseURL: 'https://asker-3e929.firebaseio.com'
})

exports.accountCreate = functions.auth.user().onCreate(async user => {
  await admin.firestore()
         .collection('users')
         .doc(user.uid)
         .set({
           superadmin: false
         })
});

exports.accountDelete = functions.auth.user().onDelete(async (user) => {
  await admin.firestore()
       .collection('users')
       .doc(user.uid)
       .delete()
});
