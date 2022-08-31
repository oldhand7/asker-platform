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

    const i18nField = useCallback((field) => {
        const { locale } = router;
    
        const isObject = typeof field === "object";

        if (isObject && locale == "en") {
          let fieldSE = typeof field['se'] !== "undefined" ? field['se'] : '';

          if (typeof field['en'] !== "undefined") return field['en'] === '' ? fieldSE : field['en'];
          if (typeof field['se'] !== "undefined") return fieldSE;
        }

        if (isObject && locale == "se") {
          let fieldEN = typeof field['en'] !== "undefined" ? field['en'] : '';

          if (typeof field['se'] !== "undefined") return field['se'] === '' ? fieldEN : field['se'];
          if (typeof field['en'] !== "undefined") return fieldEN;
        }
    
        return isObject ? '' : field;
    }, [router.locale])

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
