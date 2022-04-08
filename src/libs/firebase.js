const { initializeApp, getApps, applicationDefault } = require("firebase/app");
import {
  getAuth as firebaseGetAuth,
  updatePassword, reauthenticateWithCredential,
  EmailAuthProvider, onAuthStateChanged, updateEmail } from 'firebase/auth'
import { getFirebaseConfig } from 'libs/config';

export const getApp = () => {
    const apps = getApps()

    if (apps.length) {
      return apps[0]
    }

    return initializeApp(getFirebaseConfig());
}

export const changePassword = async (oldPassword, newPassword) => {
  const user = await getUser()

  if (!user) {
    return Promise.reject(new Error("Failed"))
  }

  const cred = EmailAuthProvider.credential(user.email, oldPassword)

  try {
    await reauthenticateWithCredential(user, cred)
  } catch (error) {
    throw new Error('Password provided invalid.')
  }

  return updatePassword(user, newPassword).catch(error => {
     throw new Error('Updating password failed.')
  })
}

export const changeEmail = async (password, newEmail) => {
  const user = await getUser()

  if (!user) {
    return Promise.reject(new Error("Failed"))
  }

  const cred = EmailAuthProvider.credential(user.email, password)

  try {
    await reauthenticateWithCredential(user, cred)
  } catch (error) {
    throw new Error('Password provided invalid.')
  }

  return updateEmail(user, newEmail).catch(error => {
     throw new Error('Email is invalid. Try another one.')
  })
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
