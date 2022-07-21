import { useRouter } from 'next/router';
import LoginForm from 'forms/login/login-form';
import { getSettings, getTranslations } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import Head from 'next/head';

import styles from 'styles/pages/login.module.scss';

const LoginPage = () => {
  const router = useRouter();
  const { user, login} = useUser()

  useEffect(() => {
    if (user) {
      router.push('/projects/')
    }
  }, [user, router])

  return <div className={styles['login-page']}>
    <Head>
      <title>Login - Asker</title>
    </Head>
    <LoginForm className={styles['login-page-form']} authFunction={login} />
  </div>
}

export const getServerSideProps = async ({ req, res}) => {
  return {
    props: {
      config: await getSettings(),
      translations: await getTranslations()
    }
  }
}

LoginPage.noAuth = true;

export default LoginPage;
