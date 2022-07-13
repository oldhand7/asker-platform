import { getAuth as firebaseGetAuth, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth'
import { getApp } from './app';

let EMULATED = false;

export const getAuth = () => {
  const auth = firebaseGetAuth(getApp())

  if (!EMULATED && process.env['NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST']) {
    const URL = `http://${process.env['NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST']}`;
    connectAuthEmulator(auth, URL);
    EMULATED = true;
  }

  return auth
}

export const getUser = () => {
  const auth = getAuth()

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
