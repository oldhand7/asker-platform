import DefaultLayout from 'layouts/default/default-layout';

import { withSite } from 'libs/site';
import { withUser } from 'libs/user';
import { withModal } from 'libs/modal';
import { useUser } from 'libs/user';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import 'styles/globals.scss'

function App({ Component, pageProps }) {
  const [user] = useUser();
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login/')
    }
  }, [user])

  const Layout = Component.layout ? Component.layout : DefaultLayout;

  return <Layout>
    <Component {...pageProps} />
  </Layout>
}

export default withUser(withSite(withModal(App)))
