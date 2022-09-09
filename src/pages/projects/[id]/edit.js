import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';
import { getSingleDocument } from 'libs/firestore-admin'
import { unpackQuestions } from 'libs/project';
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/projects-edit.module.scss';

const ProjectsEditPage = ({ project }) => {
  const { t } = useTranslation();
  
  return <div className={styles['projects-edit-page']}>
      <Head>
        <title>{project.name} - {t('actions.edit-project')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ProjectForm record={project} className={styles['projects-edit-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale && req.session.user.locale != locale) {
    const destination = `/${req.session.user.locale}/projects/${query.id}/edit`;

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
    }
  }

  const project = await getSingleDocument('projects', query.id);

  if (!project) {
    return {
      notFound: true
    }
  }

  unpackQuestions(project)

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
      config: await getSettings()
    }
  }
})

ProjectsEditPage.fullWidth = true;

export default ProjectsEditPage;
