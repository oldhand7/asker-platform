import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Container from 'components/Container/Container';
import Content from 'components/Content/Content';
import Script from 'next/script';
import { getCookie } from 'libs/helper';
import { useEffect } from 'react';
import { withRouter } from 'next/router';

import styles from './blank-layout.module.scss';

const BlankLayout = ({ children, router }) => {
  return (
    <Container className={styles['layout-container']}>
      <Content>{children}</Content>
    </Container>
  )
}

export default withRouter(BlankLayout);
