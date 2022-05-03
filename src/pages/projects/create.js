import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';
import { getSingleDocument } from 'libs/firestore-admin'

import styles from 'styles/pages/projects-create.module.scss';

const ProjectsCreatePage = ({ template }) => {
  return <div className={styles['projects-create-page']}>
      <Head>
        <title>Create project - Asker</title>
      </Head>
      <ProjectForm project={template} className={styles['projects-create-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  let template = null;

  if (query.template) {
    template = await getSingleDocument('templates', query.template)

    if (template) {
      delete template.user;

      template.template = {
        id: template.id,
        name: template.templateName
      }

      delete template.id;
      delete template.templateName;
    }
  }

  return {
    props: {
      config: await getSettings(),
      template: JSON.parse(JSON.stringify(template))
    }
  }
})

export default ProjectsCreatePage;
