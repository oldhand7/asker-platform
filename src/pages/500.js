import Head from 'next/head';
import BlankLayout from 'layouts/blank/blank-layout'

import styles from 'styles/pages/error.module.scss';

const Page500 = () => {
  return <div className={styles['error-page']}>
    <Head>
      <title>Server error - Asker</title>
      <meta name="robots" content="noindex" />
    </Head>
    <h2 className={styles['error-page-message']}>Server error.</h2>
  </div>
}

Page500.layout = BlankLayout

export default Page500;
