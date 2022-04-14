import { useRouter } from 'next/router';
import { getSettings } from 'libs/firestore-admin';
import { useEffect, useState} from 'react';
import { withUserGuardSsr } from 'libs/iron-session'
import QuestionsTable from 'components/QuestionsTable/QuestionsTable';
import LiveSearchWidget from 'components/LiveSearchWidget/LiveSearchWidget'
import Button from 'components/Button/PlatformButton';
import Head from 'next/head';
import Alert from 'components/Alert/Alert';
import { useFlash } from 'libs/flash';
import ReactPaginate from 'react-paginate';
import Pagination from 'components/Pagination/Pagination';
import Preloader from 'components/Preloader/Preloader';
import { useUser } from 'libs/user';
import { useDebounce } from 'libs/debounce';
import PlusIcon from 'components/Icon/PlusIcon';
import CriteriaFilter from 'components/CriteriaFilter/CriteriaFilter'
import FilterButton from 'components/Button/FilterButton';
import DropDownButton from 'components/DropDownButton/DropDownButton';
import {criteriaTypes} from 'libs/criteria';

import styles from 'styles/pages/questions.module.scss';

import dummyQuestions from 'data/demo/questions.json'

const PER_PAGE = 5;

const QuestionPage = ({ questions = [] }) => {
  const router = useRouter();
  const success  =  useFlash('success')
  const [user] = useUser();
  const [filter, setFiler] = useState({ q: '', company: ['asker'], criteria: [] })
  const [page, setPage] = useState(0);
  const [filteredQuestions, setQuestions] = useState(questions);

  useEffect(() => {
    if (user) {
      toggleCompany(user.companyId)
    }
  }, [user])

  useEffect(() => {
    setPage(0)
  }, [filter])


  const handleQuery = q => {
    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    return Promise.resolve([
      ...autoCompleteOptions.filter(aco => regex.test(aco.name.toLowerCase()) && !interviewers.find(i => i.id == aco.id))
    ])
  }

  const filterData = data => {

  }

  useDebounce(() => {
    const { q, company, criteria } = filter;

    let filteredQuestions = questions.filter(q => {
      const conditions = [
        company.indexOf(q.companyId) > -1,
        !criteria.length || criteria.find(c => c.id == q.criteria.type)
      ]

      return conditions.every(c => c);
    });

    if (q && filteredQuestions.length) {
      const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

      filteredQuestions = filteredQuestions.filter(data => regex.test(data.name.toLowerCase()))
    }

    setQuestions(filteredQuestions)
  }, 500, [page, filter, questions])

  const toggleCompany = (companyId) => {
    const existsAlready = filter.company.find(c => c == companyId);

    setFiler({
      ...filter,
      company: existsAlready ?
        filter.company.filter(c => c != companyId) :
        [...filter.company, companyId]
    })
  }

  const handleCriteria = criteria => {
    setFiler({
      ...filter,
      criteria
    })
  }

  return <div className={styles['questions-page']}>
      <Head>
        <title>Questions listing - Asker</title>
      </Head>

      <div className={styles['questions-page-filter']}>
        <div className={styles['questions-page-filter-company']}>
          <FilterButton className={styles['questions-page-filter-company-button']} active={filter.company.indexOf('asker') > -1} onClick={() => toggleCompany('asker')}>Asker questions</FilterButton>
          <FilterButton className={styles['questions-page-filter-company-button']} theme="grape" active={filter.company.indexOf(user && user.companyId) > -1} onClick={() => toggleCompany(user.companyId)}>Your Questions</FilterButton>
        </div>
        <CriteriaFilter className={styles['questions-page-filter-criteria']} selected={filter.criteria} onFilter={handleCriteria} />
      </div>

      <div className={styles['questions-page-nav']}>
          <LiveSearchWidget onQuery={q => setFiler({ ...filter, q })} />
          <DropDownButton onChoice={c => router.push(`/questions/create/${c.id}/`)} options={criteriaTypes}>
            <PlusIcon />Create new question
          </DropDownButton>
      </div>

      {success ? <Alert type="success">{success}</Alert> : null}

      <QuestionsTable emptyText="No questions to show." data={filteredQuestions.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)} className={styles['questions-page-table']} />

      <Pagination forcePage={page} className={styles['questions-page-pagination']} onPageChange={({ selected }) => setPage(selected)}  pageCount={Math.ceil(filteredQuestions.length / PER_PAGE)} renderOnZeroPageCount={false} />
  </div>
}

export const getServerSideProps = withUserGuardSsr(async ({ req, res}) => {
   //@TODO
  const questions = dummyQuestions;

  return {
    props: {
      config: await getSettings(),
      questions
    }
  }
})

export default QuestionPage;
