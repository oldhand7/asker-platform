import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import TemplateForm from 'forms/template/template-form';
import Head from 'next/head';

import styles from 'styles/pages/templates-create.module.scss';

const TemplatesCreatePage = () => {
  return <div className={styles['templates-create-page']}>
      <Head>
        <title>Create template - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <TemplateForm className={styles['templates-create-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      config: await getSettings()
    }
  }
})

export default TemplatesCreatePage;
