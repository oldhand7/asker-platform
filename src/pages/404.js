import Head from 'next/head';
import BlankLayout from 'layouts/blank/blank-layout'

import styles from 'styles/pages/error.module.scss';

const Page404 = () => {
  return <div className={styles['error-page']}>
    <Head>
      <title>Page not found - Asker</title>
      <meta name="robots" content="noindex" />
    </Head>
    <h2 className={styles['error-page-message']}>Page not found.</h2>
  </div>
}

Page404.layout = BlankLayout

export default Page404;
