import { createContext } from 'react';
import { useContext } from "react";

export const SiteContext = createContext();

export const withSite = (WrappedComponent) => (props) => {
    const { pageProps: { config } } = props;

    return (
      <SiteContext.Provider value={[
        config ? config : null,
        w => {
          return w; //config && config.translations && config.translations[w] ? config.translations[w] : w;
        }
      ]}>
      <WrappedComponent
        {...props}
      /></SiteContext.Provider>
    );
}

export const useSite = (locale) => useContext(SiteContext)
