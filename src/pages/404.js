import { getSettings } from 'libs/firestore-admin';

import styles from 'styles/pages/error.module.scss';

const Page404 = () => {
  return <div className={styles['error-page']}>
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
