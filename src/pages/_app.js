import DefaultLayout from 'layouts/default/default-layout';
import { withSite, useSite } from 'libs/site';
import { withUser } from 'libs/user';
import { withModal } from 'libs/modal';
import { useUser } from 'libs/user';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withDocumentsApi } from 'libs/db';
import 'libs/polyfill'
import { useTranslation } from 'libs/translation';

import 'styles/globals.scss'

function App({ Component, pageProps }) {
  const { user, logout, loading } = useUser();
  const router = useRouter()
  const { config } = useSite();
  const { t } = useTranslation()

  const [maintenence, setMaintenence] = useState(false)

  useEffect(() => {
    if (!user && !loading && !Component.noAuth) {
      router.push('/logout/')
    }
  }, [user, loading, Component, router])

  useEffect(() => {
    if (user && config && !user.developer && config.maintenence) {
      setMaintenence(config.maintenence);

      if (config.maintenence && config.maintenence != 'warning') {
        setTimeout(logout, 5000);
      }
    }
  }, [user, config, logout])


  if (maintenence && maintenence != 'warning' ) {
    return <p>{t('status.website-updating')}</p>
  }

  const Layout = Component.layout ? Component.layout : DefaultLayout;

  return <Layout fullWidth={Component.fullWidth}>
    <Component {...pageProps} />
    {maintenence == 'warning' ? <p className="maintenence-warning">{t('warnings.website-update')}</p> : null}
  </Layout>
}

export default withDocumentsApi(withUser(withSite(withModal(App))))
