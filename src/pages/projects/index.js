import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState} from 'react';
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

import styles from 'styles/pages/projects.module.scss';

const PER_PAGE = 15;

const ProjectsPage = ({ projects = [], perPage = PER_PAGE, currentPage = 1 }) => {
  const flashSuccess  =  useFlash('success')
  const [filter, setFiler] = useState({ q: ''})
  const [page, setPage] = useState(currentPage);
  const [filteredProjects, setProjects] = useState(projects);
  const router = useRouter();
  const openTemplateModal = useModal(ProjectTemplateModal, { size: 'large' })
  const [deletedProjects, setDeletedProjects] = useState([])
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (filter.q) {
      setPage(1)
    }
  }, [filter.q])

  const handleQuery = q => {
    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    return Promise.resolve([
      ...autoCompleteOptions.filter(aco => regex.test(aco.name.toLowerCase()) && !interviewers.find(i => i.id == aco.id))
    ])
  }

  useDebounce(() => {
    const { q } = filter;

    let filteredProjects = projects.filter(p => deletedProjects.indexOf(p.id) == -1);

    if (!q) {
      setProjects(filteredProjects);

      return;
    }

    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    filteredProjects = filteredProjects.filter(data => regex.test(data.name.toLowerCase()))

    setProjects(filteredProjects)
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
      .catch(setError)
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

  return <div className={styles['projects-page']}>
      <Head>
        <title>Projects - Asker</title>
      </Head>
      <div className={styles['projects-page-nav']}>
          <LiveSearchWidget q={filter.q} onQuery={q => setFiler({ q })} />
          <DropDownButton onChoice={handleProjectCreate} options={[
            { id: 'blank-project', name: 'Blank project' },
            { id: 'template-project', name: 'Use template' }
          ]}><PlusIcon /> Create new project</DropDownButton>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}
      {error ? <Alert type="error">{error.message}</Alert> : null}

      <ProjectTabe onDelete={deleteProject} emptyText="No projects to show." data={filteredProjects.slice((page - 1) * perPage, (page - 1) * perPage + perPage)} className={styles['projects-page-table']} />
      <Pagination page={page} className={styles['projects-page-pagination']} onChange={setPage} total={filteredProjects.length} perPage={perPage} />

      {loading ? <Preloader /> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  const projects = await filterManyDocuments('projects',
    [
      ['companyId', '==', req.session.user.companyId]
    ],
    [
      [query.sort || 'createdAt', query.order || (!query.sort ? 'desc' : 'asc')]
    ]
  )

  return {
    props: {
      config: await getSettings(),
      projects,
      perPage: Number.parseInt(query.perPage || PER_PAGE),
      currentPage: Number.parseInt(query.page || 1)
    }
  }
})

export default ProjectsPage;
