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

exports.stampCollections = functions.region('europe-west3').firestore.document('{collectionName}/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    if (!data.id) {
      return snap.ref.update({
        id: snap.id
      })
    }

    return null
});

exports.firebaseAccountCreate = functions.region('europe-west3').auth.user().onCreate(async (user) => {
  await admin.firestore()
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

exports.interviewCreate = functions.region('europe-west3').firestore.document('interviews/{docId}')
  .onCreate(async (snap) => {
    const interview = snap.data();

    try {
      const { increment } = admin.firestore.FieldValue;

      await admin.firestore()
        .collection('projects')
        .doc(interview.projectId)
        .update({
          interviewCount: increment(1),
          interviewAwaitingCount: increment(interview.status != 'complete' ? 1 : 0)
        })
    } catch (error) {
      console.log(error)

      return null;
    }
});

exports.updateInterview = functions.region('europe-west3').firestore.document('interviews/{docId}')
  .onUpdate(async (change) => {
    const interview = change.after.data();
    const interviewOld = change.before.data();

    if (interviewOld.status != 'complete' && interview.status == 'complete') {
      try {
        const { increment } = admin.firestore.FieldValue;

        await admin.firestore()
          .collection('projects')
          .doc(interview.projectId)
          .update({
            interviewAwaitingCount: increment(-1),
            interviewCompleteScoreSum: increment(interview.score),
          })
      } catch (error) {
        console.log(error)

        return null;
      }
    }
});

exports.interviewDelete = functions.region('europe-west3').firestore.document('interviews/{docId}')
  .onDelete(async (snap) => {
    const interview = snap.data();

    try {
      const { increment } = admin.firestore.FieldValue;

      await admin.firestore()
        .collection('projects')
        .doc(interview.projectId)
        .update({
          interviewCount: increment(-1),
          interviewAwaitingCount: increment(interview.status == 'awaiting' ? -1 : 0),
          interviewCompleteScoreSum: increment(interview.status == 'complete' ? interview.score * -1 : 0),
        })
    } catch (error) {
      console.log(error)

      return null;
    }
});

exports.platformAccountCreate = functions.region('europe-west3').firestore.document('users/{docId}')
  .onCreate(async (snap) => {
    const platformUser = snap.data();

    try {
      await updateFirebaseUserClaimsFromProfile(snap.id, platformUser)
    } catch (error) {
      console.log(error)

      return null;
    }
  });

exports.platformAccountUpdate = functions.region('europe-west3').firestore
  .document('users/{docId}')
  .onUpdate(async (change) => {
    const platformUser = change.after.data();

    try {
      await updateFirebaseUserClaimsFromProfile(platformUser.id, platformUser)
    } catch (error) {
      console.log(error)

      return null;
    }
  });

exports.platformAccountDelete = functions.region('europe-west3').firestore
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

exports.firebaseAccountDelete = functions.region('europe-west3').auth.user().onDelete(async (user) => {
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

exports.updateQuestion = functions.region('europe-west3').firestore.document('questions/{docId}')
    .onUpdate(async (change) => {
      const question = change.after.data();

      const key = `questionsMap.${question.id}`

      const batchProjects = await admin.firestore()
        .collection('projects')
        .orderBy(key)
        .get()
        .then(response => {
          let batch = admin.firestore().batch()

          response.forEach((doc) => {
             const docRef = admin.firestore().collection('projects').doc(doc.id)

             batch.update(docRef,{
               [key]: question
             })
          })

          return batch;
        })


      const batchTemplates = await admin.firestore()
        .collection('templates')
        .orderBy(key)
        .get()
        .then(response => {
          let batch = admin.firestore().batch()

          response.forEach((doc) => {
             const docRef = admin.firestore().collection('templates').doc(doc.id)

             batch.update(docRef,{
               [key]: question
             })
          })

          return batch;
        })

      await Promise.all([
        batchProjects.commit(),
        batchTemplates.commit()
      ])
  });

  exports.updateCriteriaOption = functions.region('europe-west3').firestore.document('criteriaOptions/{docId}')
    .onUpdate(async (change) => {
      const criteriaOption = change.after.data();

      const batchQuestions = await admin.firestore()
        .collection('questions')
        .where('criteria.id', '==', criteriaOption.id)
        .get()
        .then(response => {
          let batch = admin.firestore().batch()

          response.forEach((doc) => {
             const docRef = admin.firestore().collection('questions').doc(doc.id)

             batch.update(docRef,{
                criteria: criteriaOption
             })
          })

          return batch;
        })


      await batchQuestions.commit();
  });

  // Company statistics

  exports.projectCreate = functions.region('europe-west3').firestore.document('projects/{docId}')
    .onCreate(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              projectCount: increment(1),
              projectStageCount: increment(data.stages.length)
            })
        }

        return null
    });

  exports.projectUpdate = functions.region('europe-west3').firestore.document('projects/{docId}')
    .onUpdate(async (change) => {
      const dataBefore = change.before.data();
      const dataAfter = change.after.data();

      if (dataAfter.companyId) {
        const { increment } = admin.firestore.FieldValue;

        await admin.firestore()
          .collection('companies')
          .doc(dataAfter.companyId)
          .update({
            projectInterviewCount: increment((dataAfter.interviewCount  || 0) - (dataBefore.interviewCount || 0)),
            projectInterviewAwaitingCount: increment((dataAfter.interviewAwaitingCount || 0) - (dataBefore.interviewAwaitingCount || 0)),
            projectInterviewCompleteScoreSum: increment((dataAfter.interviewCompleteScoreSum || 0) - (dataBefore.interviewCompleteScoreSum || 0)),
            projectStageCount: increment(dataAfter.stages.length - dataBefore.stages.length),
          })
      }

      return null
    })

  exports.projectDelete = functions.region('europe-west3').firestore.document('projects/{docId}')
    .onDelete(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              projectCount: increment(-1),
              projectStageCount: increment(data.stages.length * - 1),
              projectInterviewCount: increment(data.interviewCount * - 1),
              projectInterviewAwaitingCount: increment(data.interviewAwaitingCount * -1)
            })
        }

        return null
    });
  
  exports.templateCreate = functions.region('europe-west3').firestore.document('templates/{docId}')
    .onCreate(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              templateCount: increment(1)
            })
        }

        return null
    });

  exports.templateDelete = functions.region('europe-west3').firestore.document('templates/{docId}')
    .onDelete(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              templateCount: increment(-1)
            })
        }

        return null
    });

  exports.userCreate = functions.region('europe-west3').firestore.document('users/{docId}')
    .onCreate(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              userCount: increment(1)
            })
        }

        return null
    });

  exports.userUpdate = functions.region('europe-west3').firestore.document('users/{docId}')
    .onUpdate(async (change) => {
        const beforeData = change.before.data();
        const afterData = change.after.data();

        if (beforeData.companyId != afterData.companyId) {
          const { increment } = admin.firestore.FieldValue;

          if (beforeData.companyId) {
            await admin.firestore()
            .collection('companies')
            .doc(beforeData.companyId)
            .update({
              userCount: increment(-1)
            })
          }

          if (afterData.companyId) {
            await admin.firestore()
            .collection('companies')
            .doc(beforeData.companyId)
            .update({
              userCount: increment(1)
            })
          }
        }

        return null
    });

  exports.userDelete = functions.region('europe-west3').firestore.document('users/{docId}')
    .onDelete(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              userCount: increment(-1)
            })
        }

        return null
    });

  exports.questionCreate = functions.region('europe-west3').firestore.document('questions/{docId}')
    .onCreate(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              questionCount: increment(1)
            })
        }

        return null
    });

  exports.questionDelete = functions.region('europe-west3').firestore.document('questions/{docId}')
    .onDelete(async (snap) => {
        const data = snap.data();

        if (data.companyId) {
          const { increment } = admin.firestore.FieldValue;

          await admin.firestore()
            .collection('companies')
            .doc(data.companyId)
            .update({
              questionCount: increment(-1)
            })
        }

        return null
    });