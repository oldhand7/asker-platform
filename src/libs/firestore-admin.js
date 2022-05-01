import { getApp } from 'libs/firebase-admin';
const { getFirestore, FieldPath } = require('firebase-admin/firestore');
import { snap2data } from 'libs/helper';

const db = getFirestore(getApp());

//fyi https://googleapis.dev/nodejs/firestore/latest/
export const getSettings = () => {
    return db.collection('settings').select('id', 'value', 'images').get().then(snap => {
      const items = {}

      for (let doc of snap.docs) {
        const d = doc.data();

        items[d.id] = d.value
      }

      return items
    })
}

export const getTranslations = (db, locale = 'en') => {
  return db.collection('translations').select('id', 'text', 'translation').get().then(snap => {
    const items = {}

    for (let doc of snap.docs) {
      const d = doc.data();

      items[d.text] = d['translation'][locale]
    }

    return items
  })
}

export const getConfig = async (db) => {
  return {
    ...(await getSettings(db)),
    translation: await getTranslations(db)
  }
}

export const getUser = (uid) => {
  return db
    .collection('users')
    .doc(uid)
    .get()
    .then(snap => snap.data())
}

export const getCompanyProjects = (companyId, sort = 'createdAt', order = 'DESC') => {
  if (!companyId) {
    return Promise.resolve([])
  }

  return db.collection('projects')
    .where('companyId', '==', companyId)
    .orderBy(sort, order)
    .get()
    .then(snap2data)
}

export const getCompanyProject = (companyId, projectId) => {
  return db
    .collection('projects')
    .where('companyId', '==', companyId)
    .where(FieldPath.documentId(), '==', projectId)
    .get()
    .then(snap2data)
    .then(res => res[0])
}


export const getCompanyInterview = (companyId, interviewId) => {
  return db
    .collection('interviews')
    .where('companyId', '==', companyId)
    .where(FieldPath.documentId(), '==', interviewId)
    .get()
    .then(snap2data)
    .then(res => res[0])
}

export const getProjectInterviews = (projectId) => {
  return db
    .collection('interviews')
    .where('projectId', '==', projectId)
    .orderBy('createdAt', 'DESC')
    .get()
    .then(snap2data)
}

export const getQuestions = (companyId, sort = 'createdAt', order = 'desc') => {
  let query = db
    .collection('questions')
    .where('companyId', 'in', [companyId, 'asker'])
    .orderBy(sort, order)

  if (sort == 'type') {
    query = query.orderBy('subtype', order)
  }

  return query.get().then(snap2data)
}

export const getSingleDocument = (col, filter = []) => {
  let query = db.collection(col)

  for (let i = 0; i < filter.length; i++) {
    query = query.where(...filter[i])
  }

  return query.get().then(snap2data).then(res => res[0])
}

export const getManyFromCollection = col => {
  let query = db.collection(col)

  return query.get().then(snap2data)
}

export const saveCollectionDocument = (col, doc) => {
  let query = db.collection(col)

  if (doc.id) {
    return query.doc(doc.id).update(doc)
  } else {
    return query.add(doc)
  }
}

export const getTemplates = (companyId, sort = 'createdAt', order = 'desc') => {
  let query = db
    .collection('templates')
    .where('companyId', 'in', [companyId, 'asker'])
    .orderBy(sort, order)

  return query.get().then(snap2data)
}

export const getCompanyTemplate = (companyId, templateIdId) => {
  return db
    .collection('templates')
    .where('companyId', 'in', [companyId, 'asker'])
    .where(FieldPath.documentId(), '==', templateIdId)
    .get()
    .then(snap2data)
    .then(res => res[0])
}
