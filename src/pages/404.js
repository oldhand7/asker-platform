import { getSettings } from 'libs/firestore-admin';
import Head from 'next/head';

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

export const getStaticProps = async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
}

export default Page404;
