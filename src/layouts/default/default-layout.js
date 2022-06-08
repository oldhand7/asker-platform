import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Container from 'components/Container/Container';
import Content from 'components/Content/Content';
import { useSite } from 'libs/site';
import { useState, useEffect } from 'react';
import { useUser } from 'libs/user';
import styles from './default-layout.module.scss';

const DefaultLayout = ({ children }) => {
  const [config] = useSite();
  const [injected, setInjected] = useState({});
  const { user } = useUser();

  useEffect(() => {
    if (injected.chat) return;

    if (user && config['tawk-property-id'] && config['tawk-client-id']) {
      import('tawkto-react')
        .then(TawkTo => TawkTo.default)
        .then(TawkTo => {
           new TawkTo(config['tawk-property-id'], config['tawk-client-id'])
        })
        .then(() => {
          setInjected({
            ...injected,
            chat: true
          })
        })
    }
  }, [config, user, injected])

  useEffect(() => {
    if (injected.ga) return;

    if (config['google-analytics-platform-id']) {
      import('ga-gtag')
        .then(gtag => {
          gtag.install(config['google-analytics-platform-id']);
        })
        .then(() => {
          setInjected({
            ...injected,
            ga: true
          })
        })
    }
  }, [config, injected])

  return (
    <Container className={styles['layout-container']}>
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </Container>
  )
}

export default DefaultLayout;
