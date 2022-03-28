import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Container from 'components/Container/Container';
import Content from 'components/Content/Content';
import Script from 'next/script';
import { getCookie } from 'libs/helper';
import { useEffect } from 'react';
import TawkTo from 'tawkto-react'
import { withRouter } from 'next/router';

import styles from './default-layout.module.scss';

const enableTawkChat = () => {
  new TawkTo(
    process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID,
    process.env.NEXT_PUBLIC_TAWK_CLIENT_ID
  )
}

const DefaultLayout = ({ children, router }) => {
  useEffect(() => {
    const cookie = getCookie('CookieConsent');

    if (cookie) {
      enableTawkChat()
    } else {
      window.addEventListener('CookiebotOnAccept', enableTawkChat)

      return () => {
        window.removeEventListener('CookiebotOnAccept', enableTawkChat)
      }
    }
  }, [])

  return (
    <Container className={styles['layout-container']}>
      <Navbar />
      <Content>{children}</Content>
      <Footer />
      <Script id="Cookiebot" src="https://consent.cookiebot.com/uc.js"  data-cbid="f1bcce11-8bca-475e-923f-b96462a091a5" data-blockingmode="auto" />
    </Container>
  )
}

export default withRouter(DefaultLayout);
