import { FirebaseAuthProvider } from 'react-admin-firebase';
import { createPairSession, logoutUser } from 'libs/api';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { connectAuthEmulator } from 'firebase/auth'

const CustomAuthProvider = (config, options) => {
  const firebaseAuthOptions = options || {}

  if (process.env['NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST']) {
    const auth = firebase.auth()
    connectAuthEmulator(auth, `http://${process.env['NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST']}`)
    firebaseAuthOptions.app = auth.app;
  }

  const authProvider = FirebaseAuthProvider(config, firebaseAuthOptions);

  const login = (params) => {
    return authProvider.login(params)
      .then(async ({ user }) => {
        const idToken = await user.getIdToken()

        return createPairSession(user.uid, idToken)
      })
  }

  const logout = async () => {
    await logoutUser()
    await authProvider.logout()
  }

  return {
    ...authProvider,
    login,
    logout
  }
}

export default CustomAuthProvider;
