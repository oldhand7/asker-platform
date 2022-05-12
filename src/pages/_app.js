import DefaultLayout from 'layouts/default/default-layout';

import { withSite } from 'libs/site';
import { withUser } from 'libs/user';
import { withModal } from 'libs/modal';
import { useUser } from 'libs/user';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import 'styles/globals.scss'

function App({ Component, pageProps }) {
  const { user, loading } = useUser();
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading && !Component.noAuth) {
      router.push('/logout/')
    }
  }, [user, loading, Component, router])

  const Layout = Component.layout ? Component.layout : DefaultLayout;

  return <Layout>
    <Component {...pageProps} />
  </Layout>
}

export default withUser(withSite(withModal(App)))
