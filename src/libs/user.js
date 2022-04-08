import { createContext } from 'react';
import { useContext, useState, useEffect } from "react";
import { getAuth, signOut, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { getApp, getUser as getFirebaseUser } from 'libs/firebase';
const { collection, getFirestore, doc, getDoc, setDoc} = require('firebase/firestore');
import { getCompany } from 'libs/company'
import { createPairSession, logoutUser } from 'libs/api';

export const destroySession = (backend = true) => {
  const auth = getAuth(getApp())

  return Promise.all([
      signOut(auth),
      backend ? logoutUser() : Promise.resolve(),
    ]).then(() => {
      localStorage.removeItem('user')

      return true;
  })
}

export const login = async (email, password) => {
  const auth = getAuth(getApp())

  //https://firebase.google.com/docs/auth/admin/manage-cookies
  await setPersistence(auth, browserLocalPersistence)

  return signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      const platformUser = await getPlatformUser(user.uid)

      const idToken = await user.getIdToken()

      try {
        const pairSession = await createPairSession(user.uid, idToken)
      } catch (error) {
        throw new Error("Pair session failed.")
      }

      if (!platformUser) {
        throw new Error("User does not exist.")
      }

      const jointUser = {
        ...platformUser,
        profile: user,
      }

      if (platformUser.companyId) {
        jointUser.company = await getCompany(platformUser.companyId)
      }

      localStorage.setItem('user', JSON.stringify(jointUser))

      return jointUser
    })
    .catch(async error => {
      throw new Error("Invalid credentials")

      await destroySession()
    })
}

export const getPlatformUser = () => {
  return getFirebaseUser()
    .then(user => {
      const db = getFirestore(getApp());

      const docRef = doc(db, "users", user.uid);

      return getDoc(docRef).then(snap => {
        return snap.exists ? snap.data() : null
      })
    })
}

export const getLocalUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const userRaw = localStorage.getItem('user');

  return userRaw ? JSON.parse(userRaw) : null;
}

export const updateLocalUserProfile = profile => {
  const userRaw = localStorage.getItem('user');

  if (!userRaw) return;

  const user = JSON.parse(userRaw);

  localStorage.setItem('user', JSON.stringify({ ...user, profile }))
}

export const UserContext = createContext();

export const withUser = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(getLocalUser());

    const handleRefresh = async () => {
      setUser(getLocalUser())
    }

    useEffect(handleRefresh, [])

    const updateProfile = (profile) => {
        return getFirebaseUser()
          .then(user => {
              const db = getFirestore(getApp());

              return setDoc(
                doc(db, "users", profile.uid),
                { images: profile.photoURL ? [ { src: profile.photoURL, title: '' } ] : [], profile: JSON.parse(JSON.stringify(profile)) },
                { merge: true }
              ).then(() => {
                updateLocalUserProfile(profile);
                handleRefresh();
              })
          })
    }

    const userApi = {
      refresh: handleRefresh,
      updateProfile: updateProfile,
      logout: () => {
        return destroySession().then(handleRefresh)
      }
    }

    return (
      <UserContext.Provider value={[user, userApi]}>
        <WrappedComponent {...props} />
      </UserContext.Provider>
    );
  };
};

export const useUser = () => useContext(UserContext)
