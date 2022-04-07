import { useState, useEffect } from "react";
import { getApp, getUser as getFirebaseUser } from 'libs/firebase';
const { collection, getFirestore, doc, getDoc, setDoc} = require('firebase/firestore');

export const getCompany = id => {
  return getFirebaseUser()
    .then(user => {
      const db = getFirestore(getApp());

      const docRef = doc(db, "companies", id);

      return getDoc(docRef).then(snap => {
        return snap.exists ? snap.data() : null
      })
    })
}

export const updateCompany = (id, data) => {
  return getFirebaseUser()
    .then(user => {
      const db = getFirestore(getApp());

      const docRef = doc(db, "companies", id);

      return setDoc(docRef, data, { merge: true })
    })
}

const cache = {}

export const useCompany = (id) => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (id) {
      if (cache[id]) {
        setCompany(cache[id])
      } else {
        getCompany(id).then(company => {
          cache[id] = company
          setCompany(company)
        })
      }
    }
  }, [id])

  const handleUpdate = (data) => {
    if (!id) {
      return Promise.resolve(new Error('No company.'))
    }

    return updateCompany(id, data)
      .then(() => {
        const updated = {
          ...company,
          ...data
        }

        cache[id] = updated

        setCompany(updated)
      })
  }

  return [company, handleUpdate];
}
