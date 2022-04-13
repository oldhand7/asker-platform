import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect, useState } from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';
import { getCompanyProject } from 'libs/firestore-admin'

import styles from 'styles/pages/projects-edit.module.scss';

const ProjectsEditPage = ({ project }) => {
  const [user] = useUser()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  return <div className={styles['projects-edit-page']}>
      <Head>
        <title>{project.name} - Edit Project - Asker</title>
      </Head>
      <ProjectForm project={project} className={styles['projects-edit-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  const project = await getCompanyProject(req.session.user.companyId, query.id);

  if (!project) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      project,
      config: await getSettings()
    }
  }
})

export default ProjectsEditPage;
