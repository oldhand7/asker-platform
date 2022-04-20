import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from 'libs/iron-session';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from 'libs/user'
import BlankLayout from 'layouts/blank/blank-layout'

import styles from 'styles/pages/logout.module.scss';

const LogoutPage = () => {
  const { logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    logout()
      .then(() => router.push('/login/'))
  }, [])

  return <div className={styles['logout-page']}>Loading...</div>
}


export const getServerSideProps = withIronSessionSsr(async ({ req, res}) => {
  await req.session.destroy()

  return {
    props: {
    }
  }
}, sessionOptions)

LogoutPage.layout = BlankLayout
LogoutPage.noAuth = true;

export default LogoutPage;
