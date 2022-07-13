import DefaultLayout from 'layouts/default/default-layout';

import { withSite, useSite } from 'libs/site';
import { withUser } from 'libs/user';
import { withModal } from 'libs/modal';
import { useUser } from 'libs/user';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import 'styles/globals.scss'

function App({ Component, pageProps }) {
  const { user, logout, loading } = useUser();
  const router = useRouter()
  const [config, t] = useSite();

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
    return <p>{t('Website is being updated and will be back soon.')}</p>
  }

  const Layout = Component.layout ? Component.layout : DefaultLayout;

  return <Layout>
    <Component {...pageProps} />
    {maintenence == 'warning' ? <p className="maintenence-warning">{t('Website is will be updated soon. Please save all changes immediatly to avoid loosing data.')}</p> : null}
  </Layout>
}

export default withUser(withSite(withModal(App)))
