import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import TemplateForm from 'forms/template/template-form';
import Head from 'next/head';
import { getSingleDocument } from 'libs/firestore-admin'

import styles from 'styles/pages/templates-edit.module.scss';

const TemplatesEditPage = ({ template }) => {
  return <div className={styles['templates-edit-page']}>
      <Head>
        <title>{template.templateName} - Edit Template - Asker</title>
      </Head>
      <TemplateForm template={template} className={styles['templates-edit-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  const template = await getSingleDocument('templates', query.id);

  if (!template) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      template: JSON.parse(JSON.stringify(template)),
      config: await getSettings()
    }
  }
})

export default TemplatesEditPage;
