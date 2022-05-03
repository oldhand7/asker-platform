import classNames from 'classnames';
import { useState, useEffect } from 'react';
import FilterButton from 'components/Button/FilterButton';
import OutlineButton from 'components/Button/OutlineButton';
import LiveSearch from 'components/LiveSearchWidget/LiveSearchWidget';
import { useUser } from 'libs/user';
import ScreeningQuestionsTable from 'components/ScreeningQuestionsTable/ScreeningQuestionsTable';
import PlusIcon from 'components/Icon/PlusIcon';
import { filterManyDocuments } from 'libs/firestore';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import ScreeningQuestionModal from 'modals/screening-question/screening-question-modal';
import { useModal } from 'libs/modal';

import styles from './ScreeningQuestionExplorer.module.scss';

const ScreeningQuestionExplorer = ({ className, criteria, questions, onQuestions, label = '', type = 'screening' }) => {
  const { user } = useUser();
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [filteredQuestions, setFilterdQuestions] = useState([])
  const [filter, setFilter] = useState({ company: ['asker', user.companyId], type: [] })
  const openScreeningQuestionModal = useModal(ScreeningQuestionModal, { type, size: 'medium'});
  const toggleCompany = (companyId) => {
    const existsAlready = filter.company.find(c => c == companyId);

    setFilter({
      ...filter,
      company: existsAlready ?
        filter.company.filter(c => c != companyId) :
        [...filter.company, companyId]
    })
  }

  const toggleType = (type) => {
    const existsAlready = filter.type.indexOf(type) > -1;

    setFilter({
      ...filter,
      type: existsAlready ?
        filter.type.filter(t => t != type) :
        [...filter.type, type]
    })
  }

  useEffect(() => {
    if (user) {
      filterManyDocuments('questions', [
        ['companyId', 'in', ['asker', user.companyId]],
        ['type', '==', type]
      ], [['name', 'asc']]).then(setAvailableQuestions)
    }
  }, [user, type])

  const handleQuestionAdd = (q) => {
    onQuestions([
      ...questions,
      q
    ])
  }

  useEffect(() => {
    const { q, company, type } = filter;

    let filteredQuestions = availableQuestions.filter(q => {
      const notSelected = !questions.find(qs => qs.id == q.id)
      const typeSelected = !type.length || type.indexOf(q.subtype) > -1
      const companySelected = company.indexOf(q.companyId) > -1;

      return notSelected && companySelected && typeSelected
    });

    if (q && filteredQuestions.length) {
      const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

      filteredQuestions = filteredQuestions.filter(q => {
        const nameQ = regex.test(q.name.toLowerCase());

        return nameQ;
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

      handleQuestionAdd(question)
    }
  }

  return <div className={classNames(styles['screening-question-explorer'], className)}>
    {
      label ?
      <h3 className={styles['screening-question-explorer-title']}>{label}</h3> :
      <h3 className={styles['screening-question-explorer-title']}>Search question</h3>
    }

    <div className={styles['screening-question-explorer-widget']}>
      <div className={styles['screening-question-explorer-widget-header']}>
        <div className={styles['screening-question-explorer-controls']}>
          <div className={styles['screening-question-explorer-company-filter']}>
            <FilterButton className={styles['screening-question-explorer-company-filter-button']} active={filter.company.indexOf('asker') > -1} onClick={() => toggleCompany('asker')}>Asker questions</FilterButton>
            <FilterButton theme='grape' className={styles['screening-question-explorer-company-filter-button']} active={filter.company.indexOf(user && user.companyId) > -1} onClick={() => toggleCompany(user && user.companyId)}>Your questions</FilterButton>
          </div>

          <OutlineButton className={styles['screening-question-explorer-add-question']} onClick={() => openScreeningQuestionModal(handleNewQuestion)}><PlusIcon /> Create new question</OutlineButton>
        </div>

        <div data-test-id="subtype-filter" className={styles['screening-question-explorer-type-filter']}>
          <FilterButton theme='' className={styles['screening-question-explorer-type-filter-button']} active={filter.type.indexOf('choice') > -1} onClick={() => toggleType('choice')}>{getScreeningQuestionLabelBySubtype('choice')}</FilterButton>
          <FilterButton theme='' className={styles['screening-question-explorer-type-filter-button']} active={filter.type.indexOf('multichoice') > -1} onClick={() => toggleType('multichoice')}>{getScreeningQuestionLabelBySubtype('multichoice')}</FilterButton>
          <FilterButton theme='' className={styles['screening-question-explorer-type-filter-button']} active={filter.type.indexOf('range') > -1} onClick={() => toggleType('range')}>{getScreeningQuestionLabelBySubtype('range')}</FilterButton>
          <FilterButton theme='' className={styles['screening-question-explorer-type-filter-button']} active={filter.type.indexOf('text') > -1} onClick={() => toggleType('text')}>{getScreeningQuestionLabelBySubtype('text')}</FilterButton>
        </div>

        <LiveSearch className={styles['screening-question-explorer-live-search']} q={filter.q} onQuery={q => setFilter({ ...filter, q})} />
      </div>

      <div className={styles['screening-question-explorer-widget-body']}>
        <ScreeningQuestionsTable className={styles['screening-question-explorer-widget-table']} onQuestion={handleQuestionAdd} data={filteredQuestions} />
      </div>
    </div>
  </div>
}

export default ScreeningQuestionExplorer;
