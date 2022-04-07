import { withIronSessionSsr } from 'iron-session/next';
import { ironSessionOptions } from 'libs/session';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from 'libs/user'
import BlankLayout from 'layouts/blank/blank-layout'

import styles from 'styles/pages/logout.module.scss';

const LogoutPage = () => {
  const [user, userApi] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      userApi.logout()
        .then(() => router.push('/login'))
    } else {
      router.push('/login')
    }
  }, [router, user, userApi])

  return <div className={styles['logout-page']}>Logging out...</div>
}

LogoutPage.layout = BlankLayout

export default LogoutPage;
