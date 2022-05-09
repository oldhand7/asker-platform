import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState, useMemo, useCallback} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import ProjectTabe from 'components/ProjectTable/ProjectTable';
import LiveSearchWidget from 'components/LiveSearchWidget/LiveSearchWidget'
import Head from 'next/head';
import Alert from 'components/Alert/Alert';
import { useFlash } from 'libs/flash';
import { filterManyDocuments } from 'libs/firestore-admin'
import Pagination from 'components/Pagination/Pagination';
import { useDebounce } from 'libs/debounce';
import PlusIcon from 'components/Icon/PlusIcon';
import { useRouter } from 'next/router';
import DropDownButton from 'components/DropDownButton/DropDownButton';
import ProjectTemplateModal from 'modals/project-template/project-template-modal';
import { useModal } from 'libs/modal';
import Preloader from 'components/Preloader/Preloader';
import { ctxError } from 'libs/helper';
import { useQueryState } from 'next-usequerystate'
import { deleteSingle } from 'libs/firestore';

import styles from 'styles/pages/projects.module.scss';

const PER_PAGE = 15;
const DEFAULT_SORT = 'createdAt';
const DEFAULT_ORDER = 'desc';

const defaultFilter = {
  q: '',
  page: 1,
  perPage: PER_PAGE,
  pristine: true
}

const ProjectsPage = ({ projects = [], total = 0 }) => {
  const flashSuccess  =  useFlash('success')
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const router = useRouter();
  const [filter, setFilter] = useState({
    ...defaultFilter,
    page: Number.parseInt(router.query.page || defaultFilter.page),
    perPage: Number.parseInt(router.query.perPage || defaultFilter.perPage)
  })
  const openTemplateModal = useModal(ProjectTemplateModal, { size: 'large' })
  const [deletedProjects, setDeletedProjects] = useState([])
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [qMax, setMaxQ] = useQueryState('fl')

  useEffect(() => {
    if (!filter.pristine) {
      setLoading(true)
      setMaxQ(true)
    }
  }, [filter.pristine])

  useDebounce(() => {
    const { q } = filter;

    let filteredProjects = projects.filter(p => deletedProjects.indexOf(p.id) == -1);

    if (!q) {
      setFilteredProjects(filteredProjects);

      return;
    }

    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    filteredProjects = filteredProjects.filter(data => regex.test(data.name.toLowerCase()))

    setFilteredProjects(filteredProjects)
  }, 500, [filter, projects, deletedProjects])

  const handleProjectCreate = c => {
    if (c.id == 'blank-project') {
      router.push('/projects/create/')
    }

    if (c.id == 'template-project') {
      openTemplateModal();
    }
  }

  const deleteProject = (p) => {
    if (!confirm('Are you sure?')) {
      return;
    }

    setLoading(true);

    deleteSingle('projects', p.id)
      .then(() => {
        setDeletedProjects([
          ...deletedProjects,
          p.id
        ])

        setLoading(false);

        setSuccess('Project deleted')
      })
      .catch(error => {
        setError(ctxError('Server error', error))
      })
  }

  useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      setError(null)
    }
  }, [success])

  useEffect(() => {
    setSuccess(flashSuccess)
  }, [flashSuccess])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(null)
      }, 7000)
    }
  }, [success])

  useEffect(() => {
    setLoading(false);
  }, [projects])

  const handlePageChange = p => {
    setFilter({ ...filter, pristine: false, page: Number.parseInt(p) })
  }

  const getRelativeTotal = () => {
    return projects.length == total ? filteredProjects.length : total
  }

  const handleQuery = useCallback(q => {
    setFilter({ ...filter, pristine: false, page: 1, q })
  }, [filter])

  const tableData = useMemo(() => filteredProjects.slice(
      (filter.page - 1) * filter.perPage,
      (filter.page - 1) * filter.perPage + filter.perPage
    ), [filter.page, filter.perPage, filteredProjects])

    const relativeTotal = useMemo(() => {
      return projects.length == total ? filteredProjects.length : total
    }, [projects, filteredProjects, total])

  return <div className={styles['projects-page']}>
      <Head>
        <title>Projects - Asker</title>
      </Head>
      <div className={styles['projects-page-nav']}>
          <LiveSearchWidget q={filter.q} onQuery={handleQuery} />
          <DropDownButton onChoice={handleProjectCreate} options={[
            { id: 'blank-project', name: 'Blank project' },
            { id: 'template-project', name: 'Use template' }
          ]}><PlusIcon /> Create new project</DropDownButton>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}
      {error ? <Alert type="error">{error.message}</Alert> : null}

      <ProjectTabe onDelete={deleteProject} emptyText="No projects to show." data={tableData} className={styles['projects-page-table']} />
      <Pagination page={filter.page} className={styles['projects-page-pagination']} onChange={handlePageChange} total={relativeTotal} perPage={filter.perPage} />

      {loading ? <Preloader /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  const dbQuery = [
    ['companyId', '==', req.session.user.companyId]
  ];

  const sort = [
    query.sort || DEFAULT_SORT,
    query.order || DEFAULT_ORDER
  ]

  const dbSort = [sort]

  let projects;
  let total;

  if (query.sort && query.order || query.fl) {
    projects = await filterManyDocuments('projects', dbQuery, dbSort)
    total = projects.length
  } else {
    const stat = { size: 0 }
    projects = await filterManyDocuments('projects', dbQuery, dbSort, 1, PER_PAGE, stat)
    total = stat.size;
  }

  return {
    props: {
      config: await getSettings(),
      projects,
      total
    }
  }
})

export default ProjectsPage;
