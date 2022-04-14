import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'

import styles from 'styles/pages/templates.module.scss';

const TemplatesPage = () => {
  return <div className={styles['templates-page']}>
      Templates page
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
})

export default TemplatesPage;
