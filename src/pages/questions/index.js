import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState, useMemo, useCallback} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import QuestionsTable from 'components/QuestionsTable/QuestionsTable';
import LiveSearchWidget from 'components/LiveSearchWidget/LiveSearchWidget'
import Head from 'next/head';
import Alert from 'components/Alert/Alert';
import { useFlash } from 'libs/flash';
import Pagination from 'components/Pagination/Pagination';
import Preloader from 'components/Preloader/Preloader';
import { useUser } from 'libs/user';
import { useDebounce } from 'libs/debounce';
import PlusIcon from 'components/Icon/PlusIcon';
import QuestionFilter from 'components/QuestionFilter/QuestionFilter'
import FilterButton from 'components/Button/FilterButton';
import DropDownButton from 'components/DropDownButton/DropDownButton';
import {criteriaTypes} from 'libs/criteria';
import {filterManyDocuments} from 'libs/firestore-admin';
import { deleteSingle } from 'libs/firestore';
import { questionTypes } from 'libs/questions';
import { ctxError } from 'libs/helper';
import { useQueryState } from 'next-usequerystate'
import { useTranslation } from 'libs/translation';

import styles from 'styles/pages/questions.module.scss';

const PER_PAGE = 15;
const DEFAULT_SORT = 'createdAt';
const DEFAULT_ORDER = 'desc';

const defaultFilter = {
   q: '',
   company: ['asker'],
   questionTypes: [] ,
   page: 1,
   pristine: true,
   perPage: PER_PAGE
}

const QuestionPage = ({ questions = [], companyId, total = 0 }) => {
  const router = useRouter();
  const flashSuccess = useFlash('success');
  const [success, setSuccess]  = useState(flashSuccess)
  const { user } = useUser();
  const [filter, setFilter] = useState({
    ...defaultFilter,
    company: ['asker', companyId],
    page: Number.parseInt(router.query.page || defaultFilter.page),
    perPage: Number.parseInt(router.query.perPage || defaultFilter.perPage)
  })
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [deletedQuestions, setDeletedQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qMax, setMaxQ] = useQueryState('fl')
  const { t, i18nField } = useTranslation();
  
  useEffect(() => {
    if (!filter.pristine) {
      setLoading(true)
      setMaxQ(true)
    }
  }, [filter.pristine, setMaxQ])

  useDebounce(() => {
    const { q, company, questionTypes } = filter;

    let filteredQuestions = questions.filter(q => {
      const inQuestionTypes = opt => {
        const isEvaluation = q.type == 'evaluation';
        return isEvaluation && q.subtype == opt.id || !isEvaluation && q.type == opt.id
      }

      const conditions = [
        company.indexOf(q.companyId) > -1,
        !questionTypes.length || questionTypes.find(inQuestionTypes),
        deletedQuestions.indexOf(q.id) === -1
      ]

      return conditions.every(c => c);
    });

    if (q && filteredQuestions.length) {
      const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

      filteredQuestions = filteredQuestions.filter(q => {
        const questionIntName = i18nField(q.name);
        const criteriaIntName = q.criteria && i18nField(q.criteria) || '';

        return regex.test(questionIntName.toLowerCase()) || regex.test(criteriaIntName.toLowerCase())
      })
    }

    setFilteredQuestions(filteredQuestions)
  }, 500, [filter, questions, deletedQuestions])

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

  const handleQuestionFilterOptions = options => {
    setFilter({
      ...filter,
      pristine: false,
      questionTypes: options,
      page: 1
    })
  }

  const deleteQuestion = (q) => {
    if (!confirm(t('actions.confirm'))) {
      return;
    }

    setLoading(true);

    deleteSingle('questions', q.id)
      .then(() => {
        setDeletedQuestions([
          ...deletedQuestions,
          q.id
        ])

        setLoading(false);

        setSuccess(t('status.question-deleted'))
      })
      .catch(error => {
        setError(ctxError(t('errors.server'), error))
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
    if (flashSuccess) {
      setSuccess(flashSuccess)
    }
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
  }, [questions])

  const tableData = useMemo(() => filteredQuestions.slice(
      (filter.page - 1) * filter.perPage,
      (filter.page - 1) * filter.perPage + filter.perPage
    ), [filter.page, filter.perPage, filteredQuestions])

  const handleQuery = useCallback(q => {
    setFilter({ ...filter, pristine: false, page: 1, q })
  }, [filter])

  const handlePageChange = useCallback(p => {
    setFilter({ ...filter, pristine: false, page: Number.parseInt(p) })
  }, [filter])

  const relativeTotal = useMemo(() => {
    return questions.length == total ? filteredQuestions.length : total
  }, [questions, filteredQuestions, total])

  return <div className={styles['questions-page']}>
      <Head>
        <title>{t('headings.questions-listing')} - Asker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles['questions-page-filter']}>
        <div data-test-id="company-filter" className={styles['questions-page-filter-company']}>
          <FilterButton className={styles['questions-page-filter-company-button']} active={filter.company.indexOf('asker') > -1} onClick={() => toggleCompany('asker')}>{t('labels.asker-questions')}</FilterButton>
          <FilterButton className={styles['questions-page-filter-company-button']} theme="dark" active={filter.company.indexOf(companyId) > -1} onClick={() => toggleCompany(user.companyId)}>{t('labels.your-questions')}</FilterButton>
        </div>
        <QuestionFilter className={styles['questions-page-filter-question-filter']} selected={filter.questionTypes} onFilter={handleQuestionFilterOptions} />
      </div>

      <div className={styles['questions-page-nav']}>
          <LiveSearchWidget q={filter.q} onQuery={handleQuery} />
          <DropDownButton onChoice={c => router.push(`/questions/create/${(c.rules ? 'evaluation' : c.id)}/${(c.rules ? `?subtype=${c.id}` : '')}`)} options={[
            ...criteriaTypes,
            ...questionTypes.filter(qt => qt.id != 'evaluation')
          ]}>
            <PlusIcon /> {t('headings.create-new-question')}
          </DropDownButton>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}
      {error ? <Alert type="error">{error.message}</Alert> : null}

      <QuestionsTable onDelete={deleteQuestion} emptyText={t('warnings.no-questions')} data={tableData} className={styles['questions-page-table']} />
      <Pagination page={filter.page} className={styles['questions-page-pagination']} onChange={handlePageChange} total={relativeTotal} perPage={filter.perPage} />

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
    const destination = `/${req.session.user.locale}/questions/`;

    return {
      redirect: {
        destination,
        locale: false,
        permanent: false,
      }
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

  if (sort[0] == 'type') {
    dbSort.push(['subtype',  sort[1]])
  }

  let questions;
  let total;

  if (query.sort && query.order || query.fl) {
    questions = await filterManyDocuments('questions', dbQuery, dbSort)
    total = questions.length
  } else {
    const stat = { size: 0 }
    questions = await filterManyDocuments('questions', dbQuery, dbSort, 1, PER_PAGE, stat)
    total = stat.size;
  }

  return {
    props: {
      config: await getSettings(),
      companyId: req.session.user.companyId,
      questions,
      total
    }
  }
})

export default QuestionPage;
