import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import TemplateTable from 'components/TemplateTable/TemplateTable';
import LiveSearchWidget from 'components/LiveSearchWidget/LiveSearchWidget'
import Button from 'components/Button/PlatformButton';
import Head from 'next/head';
import Alert from 'components/Alert/Alert';
import { useFlash } from 'libs/flash';
import { filterManyDocuments } from 'libs/firestore-admin'
import Pagination from 'components/Pagination/Pagination';
import Preloader from 'components/Preloader/Preloader';
import { useDebounce } from 'libs/debounce';
import PlusIcon from 'components/Icon/PlusIcon';
import { useRouter } from 'next/router';
import { deleteSingle } from 'libs/firestore';

import styles from 'styles/pages/templates.module.scss';

const PER_PAGE = 15;

const TemplatesPage = ({ templates = [], perPage = PER_PAGE, currentPage = 1 }) => {
  const flashSuccess  =  useFlash('success')
  const [filter, setFiler] = useState({ q: ''})
  const [page, setPage] = useState(currentPage);
  const [filteredTemplates, setTemplates] = useState(templates);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [deletedTemplates, setDeletedTemplates] = useState([]);

  useEffect(() => {
    if (flashSuccess) {
      setSuccess(flashSuccess)
    }
  }, [flashSuccess])

  useEffect(() => {
    if (filter.q) {
      setPage(1)
    }
  }, [filter.q])

  useDebounce(() => {
    const { q } = filter;

    let filteredTemplates = templates.filter(t => deletedTemplates.indexOf(t.id) == -1)

    if (!q) {
      setTemplates(filteredTemplates);

      return;
    }

    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    filteredTemplates = filteredTemplates.filter(data => regex.test(data.templateName.toLowerCase()))

    setTemplates(filteredTemplates)
  }, 500, [filter, templates, deletedTemplates])

  const deleteTemplate = (t) => {
    if (!confirm('Are you sure?')) {
      return;
    }

    setLoading(true);

    deleteSingle('templates', t.id)
      .then(() => {
        setDeletedTemplates([
          ...deletedTemplates,
          t.id
        ])

        setLoading(false);
        setSuccess('Template deleted')
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

  return <div className={styles['templates-page']}>
      <Head>
        <title>Templates listing - Asker</title>
      </Head>
      <div className={styles['templates-page-nav']}>
          <LiveSearchWidget q={filter.q} onQuery={q => setFiler({ q })} />
          <Button href='/templates/create/'><PlusIcon /> Create new template</Button>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}
      {error ? <Alert type="error">{error.message}</Alert> : null}

      <TemplateTable onDelete={deleteTemplate} emptyText="No templates to show." data={filteredTemplates.slice((page - 1) * perPage, (page - 1) * perPage + perPage)} className={styles['templates-page-table']} />

      <Pagination page={page} className={styles['templates-page-pagination']} onChange={setPage} total={filteredTemplates.length} perPage={perPage} />

      {loading ? <Preloader/> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  const templates = await filterManyDocuments('templates',
    [
      ['companyId', 'in', [req.session.user.companyId, 'asker']]
    ],
    [
      [query.sort || 'createdAt', query.order || (!query.sort ? 'desc' : 'asc')]
    ]
  )

  return {
    props: {
      config: await getSettings(),
      templates,
      perPage: Number.parseInt(query.perPage || PER_PAGE),
      currentPage: Number.parseInt(query.page || 1)
    }
  }
})

export default TemplatesPage;
