import { createContext } from 'react';
import { useContext } from "react";

export const SiteContext = createContext();

export const withSite = (WrappedComponent) => {
  const withSite = (props) => {
    const { pageProps: { config } } = props;

    return (
      <SiteContext.Provider value={[
        config ? config : null,
        w => {
          return config && config.translations && config.translations[w] ? config.translations[w] : w;
        }
      ]}>
      <WrappedComponent
        {...props}
      /></SiteContext.Provider>
    );
  };

  return withSite;
};

export const useSite = (locale) => useContext(SiteContext)
