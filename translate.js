const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { initializeApp } = require("firebase-admin/app");
const { credential } = require("firebase-admin");
const { getFirestore, FieldPath, Timestamp } = require('firebase-admin/firestore');
const baseEnTranslations = require('./src/translation/en.json');
const firebaseServiceCreds = require('./firebase-service-creds-production.json');

dotenv.config();

dotenv.config({
  path: path.resolve(process.cwd(), `.env.production`),
  override: true
});

dotenv.config({
  path: path.resolve(process.cwd(), `.env.production.local`),
  override: true
});

const snap2data = snap => {
  const items = [];

  snap.forEach((item, i) => {
    items.push(item.data())
  })

  return items;
}

const uploadTranslations = async (db, dict = {}) => {
  const query = db.collection('translations');

  query.where('text', 'in', Object.keys(dict))

  const trans = await query.get().then(snap2data)

  for (let i = 0; i < trans.length; i++) {
    delete dict[trans[i].text];
  }

  for (let key in dict) {
    const doc = {
      text: key,
      translation: {
        en: dict[key]
      }
    }

    doc.createdAt = Timestamp.now()
    doc.updatedAt = Timestamp.now()

    await query.add(doc)
  }
}

const getTranslations = async (db) => {
  const translations = await db.collection('translations').get().then(snap2data)

  const result = {}

  for (let i = 0; i < translations.length; i++) {
    result[translations[i].text] = translations[i].translation || null
  }

  return result;
}

const FIREBASE_SERVICE_KEY = process.env.FIREBASE_SERVICE_KEY_PROD || process.env.FIREBASE_SERVICE_KEY;

(async function () {
  try {
    const app = initializeApp({
      credential: credential.cert({
        ...firebaseServiceCreds,
        private_key: FIREBASE_SERVICE_KEY.replace(/\\n/g, '\n')
      })
    });
    
    const db = getFirestore(app);

    await uploadTranslations(db, baseEnTranslations)

    const dict = await getTranslations(db)

    fs.writeFileSync(path.resolve(__dirname, 'src/translation/dictionary.json'), JSON.stringify(dict))

    console.log('Downloaded translations.');
  } catch (error) {
    console.log("ERROR --->", error);
  }
})();
