import { getApp, getUser } from 'libs/firebase';
import { getFirestore, collection, query, where, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { snap2data } from 'libs/helper';

const db = getFirestore(getApp());

export const getCompanyEmployees = (companyId) => {
  const c = collection(db, 'users');
  const w = where('companyId', '==', companyId);
  const q = query(c, w)

  return getDocs(q).then(snap2data)
}

export const saveProject = (values) => {
  return getUser()
    .then(async () => {
      let d;

      if (!values.id) {
        d = doc(collection(db, "projects"));
        values.createdAt = Timestamp.now()
        values.updatedAt = Timestamp.now()
      } else {
        d = doc(db, 'projects', values.id);
        values.updatedAt = Timestamp.now()
        delete values.createdAt
      }

      await setDoc(d, values, { merge: true })

      return d.id;
    })
}

export const saveInterview = (values) => {
  return getUser()
    .then(async () => {
      let d;

      if (!values.id) {
        d = doc(collection(db, "interviews"));
        values.createdAt = Timestamp.now()
        values.updatedAt = Timestamp.now()
      } else {
        d = doc(db, 'interviews', values.id);
        values.updatedAt = Timestamp.now()
        delete values.createdAt
      }

      await setDoc(d, values, { merge: true })

      return d.id;
    })
}
