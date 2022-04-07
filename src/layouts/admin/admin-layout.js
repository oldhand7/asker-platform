import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Container from 'components/Container/Container';
import Content from 'components/Content/Content';
import Script from 'next/script';
import { getCookie } from 'libs/helper';
import { useEffect } from 'react';
import { withRouter } from 'next/router';

import styles from './admin-layout.module.scss';

const AdminLayout = ({ children, router }) => {
  return <>
  {children}
  <style global jsx>{`
  :root {
    font-size: 16px !important;
  }
  body {
    font-size: 1rem;
  }
  `}</style>
  </>
}

export default withRouter(AdminLayout);
