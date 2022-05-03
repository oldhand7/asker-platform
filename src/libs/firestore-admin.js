import { getApp } from 'libs/firebase-admin';
const { getFirestore, FieldPath } = require('firebase-admin/firestore');
import { snap2data } from 'libs/helper';

const db = getFirestore(getApp());

export const getSettings = async () => {
    const settigns = await filterManyDocuments('settings')

    const result = {}

    for (let i = 0; i < settigns.length; i++) {
      result[settigns[i].id] = settigns[i].value
    }

  return result;
}

export const getConfig = async (db) => {
  return {
    ...(await getSettings(db)),
    translation: {}
  }
}

export const filterSingleDocument = (col, filter = [], sort = []) => {
  let query = db.collection(col)

  for (let i = 0; i < filter.length; i++) {
    if (filter[i][0] == 'id') {
      filter[i][0] == FieldPath.documentId();
    }

    query = query.where(...filter[i])
  }

  for (let i = 0; i < sort.length; i++) {
    query = query.orderBy(...sort[i])
  }

  return query.get().then(snap2data).then(res => res[0])
}

export const filterManyDocuments = (col, filter = [], sort = []) => {
  let query = db.collection(col)

  for (let i = 0; i < filter.length; i++) {
    if (filter[i][0] == 'id') {
      filter[i][0] == FieldPath.documentId();
    }

    query = query.where(...filter[i])
  }

  for (let i = 0; i < sort.length; i++) {
    query = query.orderBy(...sort[i])
  }

  return query.get().then(snap2data)
}

export const getSingleDocument = (col, id) => {
  let query = db.collection(col)

  return db
    .collection(col)
    .doc(id)
    .get()
    .then(snap => snap.data())
}

export const saveCollectionDocument = (col, doc) => {
  let query = db.collection(col)

  if (doc.id) {
    return query.doc(doc.id).update(doc)
  } else {
    return query.add(doc)
  }
}
