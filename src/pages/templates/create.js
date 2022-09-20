import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import Head from 'next/head';
import ProjectForm from 'forms/project/project-form';
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/templates-create.module.scss';

const TemplatesCreatePage = () => {
  const { t } = useTranslation();

  return <div className={styles['templates-create-page']}>
      <Head>
        <title>{t('actions.create-template')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ProjectForm context='template' className={styles['templates-create-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale && req.session.user.locale != locale) {
    let destination = `/${req.session.user.locale}/templates/create/`;

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
    }
  }

  return {
    props: {
      config: await getSettings()
    }
  }
})

TemplatesCreatePage.fullWidth = true;

export default TemplatesCreatePage;
