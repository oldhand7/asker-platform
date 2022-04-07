import { getApp } from 'libs/firebase-admin';
const { getFirestore } = require('firebase-admin/firestore');

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

export const getUser = (db, uid) => {
  return db
    .collection('users')
    .doc(uid)
    .get()
    .then(snap => snap.data())
}
