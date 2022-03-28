import { FirebaseAuthProvider } from 'react-admin-firebase';
import { createPairSession, logoutUser } from 'libs/api';
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const CustomAuthProvider = (config, options) => {
  const authProvider = FirebaseAuthProvider(config, options);

  const login = (params) => {
    return authProvider.login(params)
      .then(async ({ user }) => {
        const idToken = await user.getIdToken()


        return createPairSession(user.uid, idToken)
      })
  }

  const checkAuth = async () => {
    const authenticated = await authProvider.checkAuth()

    if (!authenticated) {
      await logoutUser()

      throw new Error('Session has ended')
    }

    return true;
  }

  const logout = async () => {
    await authProvider.logout()
    await logoutUser()
  }

  return {
    ...authProvider,
    login,
    checkAuth,
    logout
  }
}

export default CustomAuthProvider;
