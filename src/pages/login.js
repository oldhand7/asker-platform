import { useRouter } from 'next/router';
import LoginForm from 'forms/login/login-form';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import Head from 'next/head';
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/login.module.scss';

const LoginPage = () => {
  const router = useRouter();
  const { user, login} = useUser()
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      router.push('/projects/')
    }
  }, [user, router])

  return <div className={styles['login-page']}>
    <Head>
      <title>{t('actions.login')} - Asker</title>
    </Head>
    <LoginForm className={styles['login-page-form']} authFunction={login} />
  </div>
}

export const getServerSideProps = async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
}

LoginPage.noAuth = true;

export default LoginPage;
