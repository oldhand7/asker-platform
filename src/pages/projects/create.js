import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';
import { getSingleDocument } from 'libs/firestore-admin'
import { unpackQuestions } from 'libs/project';
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/projects-create.module.scss';

const ProjectsCreatePage = ({ template }) => {
  const { t } = useTranslation();

  return <div className={styles['projects-create-page']}>
      <Head>
        <title>{t('actions.create.project')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ProjectForm record={template} className={styles['projects-create-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale && req.session.user.locale != locale) {
    let destination = `/${req.session.user.locale}/projects/create/`;

    if (query.template) {
      destination = `${destination}?template=${query.template}`
    }

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
    }
  }

  let template = null;

  if (query.template) {
    template = await getSingleDocument('templates', query.template)

    if (template) {
      unpackQuestions(template)

      template.template = {
        id: template.id,
        name: template.name
      }

      template.name = '';

      delete template.id;
    }
  }

  return {
    props: {
      config: await getSettings(),
      template: JSON.parse(JSON.stringify(template))
    }
  }
})

ProjectsCreatePage.fullWidth = true;

export default ProjectsCreatePage;
