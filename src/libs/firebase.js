const { initializeApp, getApps } = require("firebase/app");
import {
  getAuth as firebaseGetAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirebaseConfig } from 'libs/config';

export const getApp = () => {
    const apps = getApps()

    if (apps.length) {
      return apps[0]
    }

    return initializeApp(getFirebaseConfig());
}

export const getUser = () => {
  const auth = firebaseGetAuth(getApp())

  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser)
  }

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
        if (user) {
          resolve(user)
        } else {
          resolve(null)
        }
    })
  })
}
