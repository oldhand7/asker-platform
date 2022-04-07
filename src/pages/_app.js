import DefaultLayout from 'layouts/default/default-layout';

import { withSite } from 'libs/site';
import { withUser } from 'libs/user';
import { withModal } from 'libs/modal';

import 'styles/globals.scss'

function App({ Component, pageProps }) {
  const Layout = Component.layout ? Component.layout : DefaultLayout;

  return <Layout>
    <Component {...pageProps} />
  </Layout>
}

export default withUser(withSite(withModal(App)))
