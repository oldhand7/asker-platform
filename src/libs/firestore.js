import { getApp, getUser } from 'libs/firebase';
import { getFirestore, collection, query, where, getDocs, setDoc, doc, Timestamp,
orderBy, limit, deleteDoc, getDoc } from 'firebase/firestore/lite';
import { snap2data } from 'libs/helper';

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
