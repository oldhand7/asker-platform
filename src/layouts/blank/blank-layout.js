import Container from 'components/Container/Container';
import Content from 'components/Content/Content';
import { useEffect } from 'react';
import { useSite } from 'libs/site';

import styles from './blank-layout.module.scss';

const BlankLayout = ({ children }) => {
  const {config} = useSite();

  useEffect(() => {
    if (!config) return;

    if (config['platform-tawk-property-id'] && config['platform-tawk-client-id']) {
      import('tawkto-react')
        .then(TawkTo => TawkTo.default)
        .then(TawkTo => {
           new TawkTo(config['platform-tawk-property-id'], config['platform-tawk-client-id'])
        })
    }

    if (config['google-analytics-platform-id']) {
      import('ga-gtag')
        .then(gtag => {
          gtag.install(config['google-analytics-platform-id']);
        })
    }

    if (config['hotjar-id'] && config['hotjar-version']) {
      import('react-hotjar')
        .then(({ hotjar}) => {
          return hotjar.initialize(config['hotjar-id'], config['hotjar-version']);
        })
    }
  }, [config])

  return (
    <Container className={styles['layout-container']}>
      <Content>{children}</Content>
    </Container>
  )
}

export default BlankLayout;
