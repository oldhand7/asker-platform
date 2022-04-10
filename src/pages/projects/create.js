import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectForm from 'forms/project/project-form';

import styles from 'styles/pages/projects-create.module.scss';

const ProjectsCreatePage = () => {
  const [user] = useUser()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  return <div className={styles['projects-create-page']}>
      <ProjectForm className={styles['projects-create-page-form']} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
})

export default ProjectsCreatePage;
