import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState, useMemo, useCallback} from 'react';
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
import { ctxError } from 'libs/helper';
import { useQueryState } from 'next-usequerystate'
import FilterButton from 'components/Button/FilterButton';
import { useUser } from 'libs/user';

import styles from 'styles/pages/templates.module.scss';

const PER_PAGE = 15;
const DEFAULT_SORT = 'createdAt';
const DEFAULT_ORDER = 'desc';

const defaultFilter = {
  q: '',
  page: 1,
  company: ['asker'],
  perPage: PER_PAGE,
  pristine: true
}

const TemplatesPage = ({ templates = [], companyId, total = 0 }) => {
  const flashSuccess  =  useFlash('success')
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const router = useRouter();
  const [filter, setFilter] = useState({
    ...defaultFilter,
    company: ['asker', companyId],
    page: Number.parseInt(router.query.page || defaultFilter.page),
    perPage: Number.parseInt(router.query.perPage || defaultFilter.perPage)
  })
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [deletedTemplates, setDeletedTemplates] = useState([]);
  const [qMax, setMaxQ] = useQueryState('fl')
  const { user } = useUser();

  useEffect(() => {
    if (!filter.pristine) {
      setLoading(true)
      setMaxQ(true)
    }
  }, [filter.pristine, setMaxQ])

  useEffect(() => {
    if (flashSuccess) {
      setSuccess(flashSuccess)
    }
  }, [flashSuccess])

  useEffect(() => {
    setLoading(false);
  }, [templates])

  useDebounce(() => {
    const { q } = filter;

    let filteredTemplates = templates.filter(t => {
      const notDeleted = deletedTemplates.indexOf(t.id) == -1;
      const companyFilter = filter.company.indexOf(t.companyId) > -1;

      return companyFilter && notDeleted
    })

    if (!q) {
      setFilteredTemplates(filteredTemplates);

      return;
    }

    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    filteredTemplates = filteredTemplates.filter(data => regex.test(data.templateName.toLowerCase()))

    setFilteredTemplates(filteredTemplates)
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
      .catch(error => {
        setError(ctxError('Deleting template failed', error))
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
    if (success) {
      setTimeout(() => {
        setSuccess(null)
      }, 7000)
    }
  }, [success])

  const handlePageChange = useCallback(p => {
    setFilter({ ...filter, pristine: false, page: Number.parseInt(p) })
  }, [filter])

  const relativeTotal = useMemo(() => {
    return templates.length == total ? filteredTemplates.length : total
  }, [templates, filteredTemplates, total])

  const tableData = useMemo(() => filteredTemplates.slice(
      (filter.page - 1) * filter.perPage,
      (filter.page - 1) * filter.perPage + filter.perPage
    ), [filter.page, filter.perPage, filteredTemplates])

  const handleQuery = useCallback(q => {
    setFilter({ ...filter, pristine: false, page: 1, q })
  }, [filter])

  const toggleCompany = (companyId) => {
    const existsAlready = filter.company.find(c => c == companyId);

    setFilter({
      ...filter,
      pristine: false,
      company: existsAlready ?
        filter.company.filter(c => c != companyId) :
        [...filter.company, companyId],
      page: 1
    })
  }

  return <div className={styles['templates-page']}>
      <Head>
        <title>Templates listing - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles['templates-page-filter']}>
        <div data-test-id="company-filter" className={styles['templates-page-filter-company']}>
          <FilterButton className={styles['templates-page-filter-company-button']} active={filter.company.indexOf('asker') > -1} onClick={() => toggleCompany('asker')}>Asker templates</FilterButton>
          <FilterButton className={styles['templates-page-filter-company-button']} theme="grape" active={filter.company.indexOf(companyId) > -1} onClick={() => toggleCompany(user.companyId)}>Your templates</FilterButton>
        </div>
      </div>

      <div className={styles['templates-page-nav']}>
          <LiveSearchWidget q={filter.q} onQuery={handleQuery} />
          <Button href='/templates/create/'><PlusIcon /> Create new template</Button>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}
      {error ? <Alert type="error">{error.message}</Alert> : null}

      <TemplateTable onDelete={deleteTemplate} emptyText="No templates to show." data={tableData} className={styles['templates-page-table']} />

      <Pagination page={filter.page} className={styles['templates-page-pagination']} onChange={handlePageChange} total={relativeTotal} perPage={filter.perPage} />

      {loading ? <Preloader/> : null}
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ query, req, res}) => {
  if (!req.session.user.companyId) {
    return {
      notFound: true
    }
  }

  const dbQuery = [
    ['companyId', 'in', [req.session.user.companyId, 'asker']]
  ];

  const sort = [
    query.sort || DEFAULT_SORT,
    query.order || DEFAULT_ORDER
  ]

  const dbSort = [sort]

  let templates;
  let total;

  if (query.sort && query.order || query.fl) {
    templates = await filterManyDocuments('templates', dbQuery, dbSort)
    total = templates.length
  } else {
    const stat = { size: 0 }
    templates = await filterManyDocuments('templates', dbQuery, dbSort, 1, PER_PAGE, stat)
    total = stat.size;
  }

  return {
    props: {
      config: await getSettings(),
      templates,
      companyId: req.session.user.companyId,
      total
    }
  }
})

export default TemplatesPage;
