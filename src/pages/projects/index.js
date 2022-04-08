import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'

import styles from 'styles/pages/projects.module.scss';

const ProjectsPage = () => {
  const [user] = useUser()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  return <div className={styles['projects-page']}>
      Projects page
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
  return {
    props: {
      config: await getSettings()
    }
  }
})

export default ProjectsPage;
