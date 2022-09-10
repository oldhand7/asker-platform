import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';
import { createContext, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useContext } from "react";
import { useUser } from './user';

export const SiteContext = createContext();

export const withSite = (WrappedComponent) => (props) => {
    const { pageProps: { config } } = props;
    const router = useRouter()
    const { user, getUserLocale } = useUser()

    // useEffect(() => {
    //   const userLocale = getUserLocale();

    //   if (userLocale && userLocale != router.locale) {
    //     router.push(router.asPath, null, { locale: userLocale })
    //   }
    // }, [user])

    const tools = {
      config
    }

    return (
      <SiteContext.Provider value={tools}>
      <WrappedComponent
        {...props}
      /></SiteContext.Provider>
    );
}

export const useSite = (locale) => useContext(SiteContext)
