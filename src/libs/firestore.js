import { getUser } from 'libs/firebase/auth';
import { getApp } from 'libs/firebase/app';
import { getFirestore as getFirestore1, collection, query, where, getDocs, setDoc, doc, Timestamp,
orderBy, limit, deleteDoc, getDoc, connectFirestoreEmulator } from 'firebase/firestore/lite';
import { snap2data } from 'libs/helper';

let EMULATED = false;

const getFirestore = app => {
  const db = getFirestore1(app);

  if (!EMULATED && process.env['NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST']) {
    const parts = process.env['NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST'].split(':');
    connectFirestoreEmulator(db, ...parts);
    EMULATED = true;
  }

  return db;
}

export const saveCollectionDocument = (col, values = {})  => {
  const db = getFirestore(getApp());

  return getUser()
    .then(async () => {
      let d;

      if (!values.id) {
        d = doc(collection(db, col));

        values.id = d.id;

        values.createdAt = Timestamp.now()
        values.updatedAt = Timestamp.now()
      } else {
        d = doc(db, col, values.id);
        values.updatedAt = Timestamp.now()
        delete values.createdAt
      }

      await setDoc(d, values, { merge: true })

      return d.id;
    })
}

export const filterManyDocuments = (col, filter = [], order = [], max) => {
  const db = getFirestore(getApp());

  return getUser()
    .then(() => {
      const c = collection(db, col);

      const q = query(c, ...[
        ...filter.map(f => where(...f)),
        ...order.map(o => orderBy(...o)),
        ...(max ? [limit(max)] : [])
      ])

      return getDocs(q).then(snap2data)
    })
}

export const getSingleDocument = (col, id) => {
  const db = getFirestore(getApp());

  return getUser()
    .then(async () => {
      const dr = doc(db, col, id);
      const d = await getDoc(dr);
      return d.data()
    })
}

export const deleteSingle = (col, id) => {
  const db = getFirestore(getApp());
  return deleteDoc(doc(db, col, id));
}