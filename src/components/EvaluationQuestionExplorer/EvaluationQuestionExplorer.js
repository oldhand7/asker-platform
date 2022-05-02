import classNames from 'classnames';
import { useState, useEffect } from 'react';
import FilterButton from 'components/Button/FilterButton';
import OutlineButton from 'components/Button/OutlineButton';
import LiveSearch from 'components/LiveSearchWidget/LiveSearchWidget';
import { useUser } from 'libs/user';
import EvaluationQuestionsTable from 'components/EvaluationQuestionsTable/EvaluationQuestionsTable';
import PlusIcon from 'components/Icon/PlusIcon';
import { getManyFromCollection } from 'libs/firestore';
import EvaluationQuestionModal from 'modals/evaluation-question/evaluation-question-modal';
import { useModal } from 'libs/modal';

import styles from './EvaluationQuestionExplorer.module.scss';

const EvaluationQuestionExplorer = ({ className, criteria, questions, onQuestions, label = '' }) => {
  const { user } = useUser();
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [filteredQuestions, setFilterdQuestions] = useState([])
  const [filter, setFilter] = useState({ q: '', company: ['asker', user.companyId] })
  const openEvaluationQuestionModal = useModal(
    EvaluationQuestionModal,
    { type: criteria, size: 'large' }
  );

  const toggleCompany = (companyId) => {
    const existsAlready = filter.company.find(c => c == companyId);

    setFilter({
      ...filter,
      company: existsAlready ?
        filter.company.filter(c => c != companyId) :
        [...filter.company, companyId]
    })
  }

  useEffect(() => {
    if (user) {
      getManyFromCollection('questions', [
        ['companyId', 'in', ['asker', user.companyId]],
        ['criteria.type', '==', criteria.id]
      ], [['criteria.name', 'asc'], ['name', 'asc']]).then(setAvailableQuestions)
    }
  }, [user, criteria])

  const handleQuestionAdd = (q) => {
    onQuestions([
      ...questions,
      q
    ])
  }

  useEffect(() => {
    const { q, company } = filter;

    let filteredQuestions = availableQuestions.filter(q => {
      const notSelected = !questions.find(qs => qs.id == q.id)
      return notSelected && company.indexOf(q.companyId) > -1
    });

    if (q && filteredQuestions.length) {
      const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

      filteredQuestions = filteredQuestions.filter(q => {
        const nameQ = regex.test(q.name.toLowerCase());
        const criteriaQ = regex.test(q.criteria.name.toLowerCase());

        return nameQ || criteriaQ;
      })
    }

    setFilterdQuestions(filteredQuestions)
  }, [filter, availableQuestions, questions])

  const handleNewQuestion = (question) => {
    if (question && question.name) {
      setAvailableQuestions([
        ...availableQuestions,
        question
      ])

      handleQuestionAdd(question);
    }
  }

  return <div className={classNames(styles['evaluation-question-explorer'], className)}>
    {
      label ?
      <h3 className={styles['evaluation-question-explorer-title']}>{label}</h3> :
      <h3 className={styles['evaluation-question-explorer-title']}>Search {criteria.name} or question</h3>
    }

    <div className={styles['evaluation-question-explorer-widget']}>
      <div className={styles['evaluation-question-explorer-widget-header']}>
        <div className={styles['evaluation-question-explorer-controls']}>
          <div className={styles['evaluation-question-explorer-company-filter']}>
            <FilterButton theme='green' className={styles['evaluation-question-explorer-company-filter-button']} active={filter.company.indexOf('asker') > -1} onClick={() => toggleCompany('asker')}>Asker questions</FilterButton>
            <FilterButton theme='grape' className={styles['evaluation-question-explorer-company-filter-button']} active={filter.company.indexOf(user && user.companyId) > -1} onClick={() => toggleCompany(user && user.companyId)}>Your questions</FilterButton>
          </div>

          <OutlineButton className={styles['evaluation-question-explorer-add-question']} onClick={() => openEvaluationQuestionModal(handleNewQuestion)}><PlusIcon /> Create new question</OutlineButton>
        </div>
        <LiveSearch className={styles['evaluation-question-explorer-live-search']} q={filter.q} onQuery={q => setFilter({ ...filter, q})} />
      </div>

      <div className={styles['evaluation-question-explorer-widget-body']}>
        <EvaluationQuestionsTable criteria={criteria} className={styles['evaluation-question-explorer-widget-table']} onQuestion={handleQuestionAdd} data={filteredQuestions} />
      </div>
    </div>
  </div>
}

export default EvaluationQuestionExplorer;
