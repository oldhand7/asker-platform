import { getApp } from 'libs/firebase';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut,
updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, browserLocalPersistence,
setPersistence } from "firebase/auth";
import { useState, useEffect } from 'react';
import { saveCollectionDocument } from 'libs/firestore';
import { createPairSession } from 'libs/api';
import { ctxError } from 'libs/helper';

const getLocalMetauser = () => {
  if (typeof window === "undefined") {
    return;
  }

  const metauserRaw = window.localStorage.getItem('metauser');

  if (!metauserRaw) {
    return;
  }

  return JSON.parse(metauserRaw)
}

const setLocalMetauser = (metauser) => {
  const metauserRaw = JSON.stringify(metauser)

  window.localStorage.setItem('metauser', metauserRaw);
}

const removeLocalMetauser = () => {
  window.localStorage.removeItem('metauser');
}

export const useAuth = () => {
  const [user, setUser] = useState(getLocalMetauser());
  const [wait, setWait] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const userBoot = firebaseUser => {
    if (!firebaseUser) {
      removeLocalMetauser();
      setUser(null);

      return;
    }

    const metauser = getLocalMetauser();

    if (!metauser || metauser.id != firebaseUser.uid) {
      removeLocalMetauser();
      setUser(null);

      return;
    }

    if (JSON.stringify(user) != JSON.stringify(metauser)) {
      setUser(metauser)
    }

    setFirebaseUser(firebaseUser)
  }

  useEffect(() => {
    if (wait) {
      return;
    }

    const auth = getAuth(getApp())
    const unlisten = onAuthStateChanged(auth, userBoot)

    return () => unlisten();
  }, [wait])


  const login = (email, password) => {
    setWait(true);

    const auth = getAuth(getApp());

    return setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
          try {
            const idToken = await user.getIdToken()
            const metauser = await createPairSession(user.uid, idToken)
            setLocalMetauser(metauser)
            userBoot(user);
            setWait(false);
          } catch (error) {
            throw new Error("Pair session failed.")
          }
        })
      })
  }

  const logout = async () => {
    const auth = getAuth(getApp());

    return signOut(auth)
  }

  const updateProfile = (profile) => {
    return saveCollectionDocument('users', profile)
      .then(() => {
        setLocalMetauser(profile)
        setUser(profile)
      })
  }

  const changePassword = async (newPassword, password) => {
    const cred = EmailAuthProvider.credential(firebaseUser.email, password)

    try {
      await reauthenticateWithCredential(firebaseUser, cred)
    } catch (error) {
      throw new Error('Password provided invalid.')
    }

    return updatePassword(firebaseUser, newPassword).catch(error => {
       throw new Error('Updating password failed.')
    })
  }

  const changeEmail = async (email, password) => {
    const cred = EmailAuthProvider.credential(firebaseUser.email, password)

    try {
      await reauthenticateWithCredential(firebaseUser, cred)
    } catch (error) {
      throw ctxError('Password invalid.', error)
    }

    return updateEmail(firebaseUser, email).catch(error => {
       throw ctxError('Email invalid. Try another one.', error)
    })
  }

  const getAvatar = () => {
    return user && user.images && user.images.length ? user.images[0].src : '';
  }

  return {
    user,
    loading: wait || typeof user === "undefined",
    login,
    logout,
    updateProfile,
    changePassword,
    changeEmail,
    getAvatar
  }
}
