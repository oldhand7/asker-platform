import { getSettings, getTranslations } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import TemplateForm from 'forms/template/template-form';
import Head from 'next/head';
import { getSingleDocument } from 'libs/firestore-admin'
import { unpackQuestions } from 'libs/project';

import styles from 'styles/pages/templates-edit.module.scss';

const TemplatesEditPage = ({ template }) => {
  return <div className={styles['templates-edit-page']}>
      <Head>
        <title>{template.templateName} - Edit Template - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <TemplateForm template={template} className={styles['templates-edit-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale != locale) {
    let destination = `/${req.session.user.locale}/templates/${query.id}/edit/`;

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
    }
  }

  const template = await getSingleDocument('templates', query.id);

  if (!template) {
    return {
      notFound: true
    }
  }

  unpackQuestions(template)

  return {
    props: {
      template: JSON.parse(JSON.stringify(template)),
      config: await getSettings(),
      translations: await getTranslations()
    }
  }
})

export default TemplatesEditPage;
