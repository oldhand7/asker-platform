import { getSettings } from 'libs/firestore-admin';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';
import { getSingleDocument } from 'libs/firestore-admin'
import { unpackQuestions } from 'libs/project';

import styles from 'styles/pages/projects-edit.module.scss';

const ProjectsEditPage = ({ project }) => {
  return <div className={styles['projects-edit-page']}>
      <Head>
        <title>{project.name} - Edit Project - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <ProjectForm project={project} className={styles['projects-edit-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
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

export default ProjectsEditPage;
