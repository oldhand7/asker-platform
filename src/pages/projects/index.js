import { getSettings, getTranslations } from 'libs/firestore-admin';
import { useEffect, useState, useMemo, useCallback} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
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
import ProjectList from 'components/ProjectList/ProjectList';
import { useSite } from 'libs/site';

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
  const { t } = useSite();

  useEffect(() => {
    if (!filter.pristine) {
      setLoading(true)
      setMaxQ(true)
    }
  }, [filter.pristine, setMaxQ])

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
        <title>{t('Projects listing')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className={styles['projects-page-nav']}>
          <LiveSearchWidget className={styles['projects-page-search']} q={filter.q} onQuery={handleQuery} />
          <DropDownButton className={styles['projects-page-create-button']} onChoice={handleProjectCreate} options={[
            { id: 'blank-project', name: 'Blank project' },
            { id: 'template-project', name: 'Use template' }
          ]}><PlusIcon /> {t('Create new project')}</DropDownButton>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}
      {error ? <Alert type="error">{error.message}</Alert> : null}

      <ProjectList onDelete={deleteProject} emptyText="No projects to show." data={tableData} className={styles['projects-page-list']} />
      <Pagination page={filter.page} className={styles['projects-page-pagination']} onChange={handlePageChange} total={relativeTotal} perPage={filter.perPage} />

      {loading ? <Preloader /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, locale }) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  if (req.session.user.locale && req.session.user.locale != locale) {
    const destination = `/${req.session.user.locale}/projects/`;

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
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
      translations: await getTranslations(),
      projects,
      total
    }
  }
})

export default ProjectsPage;
