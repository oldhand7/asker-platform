import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectTabe from 'components/ProjectTable/ProjectTable';
import LiveSearchWidget from 'components/LiveSearchWidget/LiveSearchWidget'
import Button from 'components/Button/PlatformButton';
import Head from 'next/head';
import Alert from 'components/Alert/Alert';
import { useFlash } from 'libs/flash';
import { getCompanyProjects as getCompanyProjectsAdmin } from 'libs/firestore-admin'
import ReactPaginate from 'react-paginate';
import Pagination from 'components/Pagination/Pagination';
import Preloader from 'components/Preloader/Preloader';
import { useUser } from 'libs/user';
import { useDebounce } from 'libs/debounce';
import PlusIcon from 'components/Icon/PlusIcon';

import styles from 'styles/pages/projects.module.scss';

const PER_PAGE = 15;

const ProjectsPage = ({ projects = [], total = 0 }) => {
  const router = useRouter();
  const success  =  useFlash('success')
  const [user] = useUser();
  const [filter, setFiler] = useState({ q: ''})
  const [page, setPage] = useState(0);
  const [filteredProjects, setProjects] = useState(projects);

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  useEffect(() => {
    setPage(0)
  }, [filter.q])


  const handleQuery = q => {
    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    return Promise.resolve([
      ...autoCompleteOptions.filter(aco => regex.test(aco.name.toLowerCase()) && !interviewers.find(i => i.id == aco.id))
    ])
  }

  const filterData = data => {

  }

  useDebounce(() => {
    const { q } = filter;

    if (!q) {
      setProjects(projects);

      return;
    }

    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    const filteredProjects = projects.filter(data => regex.test(data.name.toLowerCase()))

    setProjects(filteredProjects)
  }, 500, [page, filter, projects])

  return <div className={styles['projects-page']}>
      <Head>
        <title>Projects - Asker</title>
      </Head>
      <div className={styles['projects-page-nav']}>
          <LiveSearchWidget onQuery={q => setFiler({ q })} />
          <Button href='/projects/create/'><PlusIcon /> Create new project</Button>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}

      <ProjectTabe emptyText="No projects to show." data={filteredProjects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)} className={styles['projects-page-table']} />

      <Pagination forcePage={page} className={styles['projects-page-pagination']} onPageChange={({ selected }) => setPage(selected)}  pageCount={Math.ceil(filteredProjects.length / PER_PAGE)} renderOnZeroPageCount={false} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
  const projects = await getCompanyProjectsAdmin(req.session.user.companyId)
  
  return {
    props: {
      config: await getSettings(),
      projects
    }
  }
})

export default ProjectsPage;
