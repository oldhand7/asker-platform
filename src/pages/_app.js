import 'styles/globals.scss'

import DefaultLayout from 'layouts/default/default-layout';
import AdminLayout from 'layouts/admin/admin-layout';
import { withSite } from 'libs/site';

function App({ Component, pageProps }) {
  const Layout = Component.layout === 'admin' ? AdminLayout : DefaultLayout;

  return <Layout>
    <Component {...pageProps} />
  </Layout>
}

export default withSite(App)
