import { getSettings, getTranslations } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import TemplateForm from 'forms/template/template-form';
import Head from 'next/head';
import { useSite } from 'libs/site';

import styles from 'styles/pages/templates-create.module.scss';

const TemplatesCreatePage = () => {
  const { t } = useSite();

  return <div className={styles['templates-create-page']}>
      <Head>
        <title>{t('Create template')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <TemplateForm className={styles['templates-create-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale != locale) {
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
      config: await getSettings(),
      translations: await getTranslations()
    }
  }
})

export default TemplatesCreatePage;
