import { getApp } from 'libs/firebase-admin';
const { getFirestore } = require('firebase-admin/firestore');

export const getSettings = (db) => {
    return db.collection('settings').select('id', 'value', 'images').get().then(snap => {
      const items = {}

      for (let doc of snap.docs) {
        const d = doc.data();

        items[d.id] = d.value
      }

      return items
    })
}

export const getEmployees = (db) => {
  return db.collection('employees').orderBy('sort', 'asc').get().then(snap => {
    const items = []

    for (let doc of snap.docs) {
      items.push(doc.data())
    }

    return items
  })
}

export const getPageBySlug = async (db, slug, locale = 'en') => {
  const snap = await db.collection('pages').where(`name.${locale}`, "==", slug).get();

  return snap.docs.length ? snap.docs[0].data() : null;
}

export const getPageByTemplate = async (db, template = '') => {
  const snap = await db.collection('pages').where('template', "==", template).get();

  return snap.docs.length ? snap.docs[0].data() : null;
}

export const getSectionByName = (db, name, locale = 'en') => {
  return db.collection('sections').where(`name.${locale}`, "==", name).get().then(snap => {
    return snap.docs[0].data()
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
    translation: await getTranslations(db),
    menu: await getMenu(db)
  }
}

export const getMenu = (db, pos = 'header') => {
  return db
    .collection('pages')
    .select('id', 'name', 'title', 'template')
    .where(`menu.${pos}`, '==', true)
    .orderBy('sort', 'asc').get()
    .then(snap => {
      const items = []

      for (let doc of snap.docs) {
        items.push(doc.data())
      }

      return items
  })
}

export const withFirestoreSsr =  (ssrFunc) => {
  return async (context) => {
    context.firestore = await getFirestore(getApp());

    return ssrFunc(context)
  }
}

export const getPages = db => {
  return db
    .collection('pages')
    .select('id', 'name', 'title', 'template')
    .where('template', '!=', '')
    .get()
    .then(snap => {
      const items = []

      for (let doc of snap.docs) {
        items.push(doc.data())
      }

      return items
  })
}

export const getUser = (db, uid) => {
  return db
    .collection('users')
    .doc(uid)
    .get()
    .then(snap => snap.data())
}
