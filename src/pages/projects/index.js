import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useUser } from 'libs/user';
import { useEffect} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectTabe from 'components/ProjectTable/ProjectTable';
import SearchWidget from 'components/SearchWidget/SearchWidget'
import Button from 'components/Button/PlatformButton';
import Head from 'next/head';

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
      <Head>
        <title>Projects - Asker</title>
      </Head>
      <div className={styles['projects-page-nav']}>
          <SearchWidget />
          <Button href='/projects/create/'>Create new project</Button>
      </div>

      <ProjectTabe className={styles['projects-page-table']} />
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
