import { getSettings, getTranslations } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';
import { getSingleDocument } from 'libs/firestore-admin'
import { unpackQuestions } from 'libs/project';

import styles from 'styles/pages/projects-edit.module.scss';
import { useSite } from 'libs/site';

const ProjectsEditPage = ({ project }) => {
  const { t } = useSite();
  
  return <div className={styles['projects-edit-page']}>
      <Head>
        <title>{project.name} - {t('Edit project')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ProjectForm project={project} className={styles['projects-edit-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale != locale) {
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
      config: await getSettings(),
      translations: await getTranslations()
    }
  }
})

export default ProjectsEditPage;
