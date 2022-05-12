import { useRouter } from 'next/router';
import ForgottenForm from 'forms/forgotten/forgotten-form';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import Head from 'next/head';

import styles from 'styles/pages/forgotten.module.scss';

const ForgottenPage = () => {
  const router = useRouter();
  const { user, login} = useUser()

  useEffect(() => {
    if (user) {
      router.push('/projects/')
    }
  }, [user, router])

  return <div className={styles['forgotten-page']}>
    <Head>
      <title>Forgotten - Login - Asker</title>
      <meta name="robots" content="noindex" />
    </Head>
    <ForgottenForm className={styles['forgotten-page-form']}  />
  </div>
}

export const getServerSideProps = async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
}

ForgottenPage.noAuth = true;

export default ForgottenPage;
