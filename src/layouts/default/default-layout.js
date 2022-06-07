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
  const [injected, setInjected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (injected) return;

    if (user && config['tawk-property-id'] && config['tawk-client-id']) {
      console.log('starting')
      import('tawkto-react')
        .then(TawkTo => TawkTo.default)
        .then(TawkTo => {
           new TawkTo(config['tawk-property-id'], config['tawk-client-id'])
        })
    }
  }, [config, injected, user])

  return (
    <Container className={styles['layout-container']}>
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </Container>
  )
}

export default DefaultLayout;
