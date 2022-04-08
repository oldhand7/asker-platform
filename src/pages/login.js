import { login, destroySession } from 'libs/user';
import { useRouter } from 'next/router';
import LoginForm from 'forms/login/login-form';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';

import styles from 'styles/pages/login.module.scss';

const LoginPage = () => {
  const router = useRouter();
  const [user, userApi] = useUser()

  const handleLogin = () => {
    userApi.refresh()
  }

  useEffect(() => {
    if (user) {
      router.push('/projects/')
    }
  }, [user])

  useEffect(() => {
    const { query } = router;

    if (query.logout) {
      userApi.logout()
    }
  }, [router])

  return <div className={styles['login-page']}>
    <LoginForm className={styles['login-page-form']} authFunction={login} onSuccess={handleLogin} />
  </div>
}

export const getServerSideProps = async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
}

export default LoginPage;
