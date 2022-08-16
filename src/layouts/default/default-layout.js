import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Container from 'components/Container/Container';
import Content from 'components/Content/Content';
import { useSite } from 'libs/site';
import { useState, useEffect } from 'react';
import { useUser } from 'libs/user';
import Alert from 'components/Alert/Alert';

import styles from './default-layout.module.scss';

const DefaultLayout = ({ children }) => {
  const {config} = useSite();
  const { user } = useUser();

  useEffect(() => {
    if (config['platform-tawk-property-id'] && config['platform-tawk-client-id']) {
      import('tawkto-react')
        .then(TawkTo => TawkTo.default)
        .then(TawkTo => {
           new TawkTo(config['platform-tawk-property-id'], config['platform-tawk-client-id'])
        })
    }

    if (config['google-analytics-platform-id']) {
      import('ga-gtag')
        .then(gtag => {
          gtag.install(config['google-analytics-platform-id']);
        })
    }

    if (config['hotjar-id'] && config['hotjar-version']) {
      import('react-hotjar')
        .then(({ hotjar}) => {
          return hotjar.initialize(config['hotjar-id'], config['hotjar-version']);
        })
    }
  }, [config])

  return (
    <Container className={styles['layout-container']}>
      <Navbar />
      <Content>{user && user.disabled ? <Alert className={styles['layout-account-disabled']}>Your account has been deactivated. Please reach out to info@askertech.com if you want to reactivate your account.</Alert> : children}</Content>
      <Footer />
      {process.env.NEXT_PUBLIC_APP_ENV == 'beta' ? <span className="beta-label">Staging server</span> : null}
    </Container>
  )
}

export default DefaultLayout;
