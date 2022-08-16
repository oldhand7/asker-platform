import { useAuth } from './auth';
import { createContext, useContext, useMemo } from 'react';
import { storeRemoteUserLocale } from 'libs/api'
import { useRouter } from 'next/router';

export const UserContext = createContext();

const getUserLocale = (user) => {
  if (typeof window === "undefined") {
    return;
  }

  return user && user.locale || window.localStorage.getItem('user_locale') || 'en';
}

const storeUserLocale = (locale, user) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem('user_locale', locale);

  if (user) {
    return storeRemoteUserLocale(locale);
  } else {
    return Promise.resolve();
  }
}

export const withUser = (WrappedComponent) => {
  return (props) => {
    const auth = useAuth();
    const { locale } = useRouter()

    const tools = useMemo(() => ({
      ...auth,
      locale,
      storeUserLocale: (locale) => storeUserLocale(locale,  auth.user),
      getUserLocale: () => getUserLocale(auth.user)
    }), [auth])

    return (
      <UserContext.Provider value={tools}>
        <WrappedComponent {...props} />
      </UserContext.Provider>
    );
  };
};

export const useUser = () => useContext(UserContext)
