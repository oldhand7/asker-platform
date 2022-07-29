import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useContext } from "react";
import { useUser } from './user';

export const SiteContext = createContext();

export const withSite = (WrappedComponent) => (props) => {
    const { pageProps: { config, translations } } = props;
    const router = useRouter()
    const { user, getUserLocale } = useUser()

    const t = useCallback((w) => {
      if (w && translations && translations[w] === "undefined" && user && user.developer) {
        console.warn(`Translation missing:`, w)
      }

      return translations && translations[w] && translations[w][router.locale] ? translations[w][router.locale] : w;
    }, [translations, user])

    useEffect(() => {
      const userLocale = getUserLocale();
      
      if (userLocale && userLocale != router.locale) {
        router.push(router.asPath, null, { locale: userLocale })
      }
    }, [user])

    const i18nField = (field) => {
        const { locale } = router;
    
        const isObject = typeof field === "object";
    
        if (isObject && typeof field[locale] !== "undefined") return field[locale];
        if (isObject && typeof field['en'] !== "undefined") return field['en'];
    
        return isObject ? '' : field;
    }

    const tools = {
      config,
      t,
      i18nField
    }

    return (
      <SiteContext.Provider value={tools}>
      <WrappedComponent
        {...props}
      /></SiteContext.Provider>
    );
}

export const useSite = (locale) => useContext(SiteContext)
