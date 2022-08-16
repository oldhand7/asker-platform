import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from 'libs/iron-session';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from 'libs/user'
import BlankLayout from 'layouts/blank/blank-layout'
import Head from 'next/head';
import { getTranslations } from 'libs/firestore-admin';

import styles from 'styles/pages/logout.module.scss';
import { useSite } from 'libs/site';

const LogoutPage = () => {
  const { logout } = useUser();
  const router = useRouter();
  const { t } = useSite()

  useEffect(() => {
    logout()
      .then(() => router.push('/login/'))
  }, [router, logout])

  return <div className={styles['logout-page']}>
    <Head>
      <title>{t('Logging out...')}</title>
      <meta name="robots" content="noindex" />
    </Head>
    <div>{t('Loading...')}</div>
  </div>
}


export const getServerSideProps = withIronSessionSsr(async ({ req, res}) => {
  await req.session.destroy()

  return {
    props: {
      translations: await getTranslations()
    }
  }
}, sessionOptions)

LogoutPage.layout = BlankLayout
LogoutPage.noAuth = true;

export default LogoutPage;
