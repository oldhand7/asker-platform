import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Container from 'components/Container/Container';
import Content from 'components/Content/Content';
import Script from 'next/script';
import { getCookie } from 'libs/helper';
import { useEffect } from 'react';
import { withRouter } from 'next/router';

import styles from './default-layout.module.scss';

const DefaultLayout = ({ children, router }) => {
  return (
    <Container className={styles['layout-container']}>
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </Container>
  )
}

export default withRouter(DefaultLayout);
