import { getSettings } from 'libs/firestore-admin';
import { useEffect} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';
import Head from 'next/head';

import styles from 'styles/pages/projects-create.module.scss';

const ProjectsCreatePage = () => {
  return <div className={styles['projects-create-page']}>
      <Head>
        <title>Create project - Asker</title>
      </Head>
      <ProjectForm className={styles['projects-create-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }
  
  return {
    props: {
      config: await getSettings()
    }
  }
})

export default ProjectsCreatePage;
