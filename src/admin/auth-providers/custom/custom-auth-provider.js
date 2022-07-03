import { FirebaseAuthProvider } from 'react-admin-firebase';
import { createPairSession, logoutUser } from 'libs/api';

const CustomAuthProvider = (config, options) => {
  const firebaseAuthOptions = options || {}

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
