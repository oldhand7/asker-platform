/** @type {import('next').NextConfig} */
const i18n = require('./i18n.json');
const { getApp } = require('./src/libs/firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const getPages = (db) => {
  return db
    .collection('pages')
		.where('template', '!=', '')
    .select('id', 'name', 'title', 'template')
		.get()
    .then(snap => {
      const items = []

      for (let doc of snap.docs) {
        items.push(doc.data())
      }

      return items
  })
}

module.exports = {
	reactStrictMode: true,
	trailingSash: true,
	i18n
};
