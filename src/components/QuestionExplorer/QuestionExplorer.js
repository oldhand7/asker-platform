import classNames from 'classnames';
import { useState, useEffect, useRef, useCallback } from 'react';
import OutlineButton from 'components/Button/OutlineButton';
import LiveSearch from 'components/LiveSearchWidget/LiveSearchWidget';
import { useUser } from 'libs/user';
import PlusIcon from 'components/Icon/PlusIcon';
import { filterManyDocuments } from 'libs/firestore';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import ScreeningQuestionModal from 'modals/screening-question/screening-question-modal';
import EvaluationQuestionModal from 'modals/evaluation-question/evaluation-question-modal';
import { useModal } from 'libs/modal';
import CheckboxButton from 'components/Button/CheckboxButton';
import QuestionExplorerQuestionList from 'components/QuestionExplorerQuestionList/QuestionExplorerQuestionList';
import QuestionExplorerOption from 'components/QuestionExplorerOption/QuestionExplorerOption';

import styles from './QuestionExplorer.module.scss';
import VerticalDotsIcon from 'components/Icon/VerticalDotsIcon';
import LiveSelect from 'components/LiveSelect/LiveSelect';
import { useSite } from 'libs/site';

const countSort = function(a, b) {
  if (a.count < b.count) return -1;
  if (a.count > b.count) return 1;

  return 0;
}

const CreateButton = (props) => {
  const { t } = useSite();

  return <OutlineButton className={styles['question-explorer-create']} {...props}>
  <PlusIcon className={styles['question-explorer-create-icon']} />
  <span className={styles['question-explorer-create-text']}>{t('Create')}</span>
</OutlineButton>
}

const QuestionExplorer = ({ className, questions, onQuestions, label = '', type = 'screening', subtype = '' }) => {
  const { user, locale } = useUser();
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [filteredQuestions, setFilterdQuestions] = useState([])
  const [filter, setFilter] = useState({ company: ['asker', user.companyId], type: [] })
  const { i18nField, t } = useSite();

  const openScreeningQuestionModal = useModal(ScreeningQuestionModal, { size: 'medium'});
  const openEvaluationQuestionModal = useModal(EvaluationQuestionModal, { size: 'large'});

  const [evaluationCriterias, setEvaluationCriterias] = useState([])

  const [filterControlOpen, setFilterControlOpen] = useState(false);

  const filterControlPopupRef = useRef();

  useEffect(() => {
    if (filterControlOpen) {
      const handleKey = (ev) => {
        if (ev.code == "Escape") {
          ev.preventDefault();

          setFilterControlOpen(false);
        }
      }

      document.body.addEventListener('keyup', handleKey);

      return () => {
        document.body.removeEventListener('keyup', handleKey);
      }
    }
  }, [filterControlOpen])

  useEffect(() => {
    if (type == 'evaluation' && subtype != 'motivation' && subtype != 'culture') {
      const evaluationCriteriaStats = {}

      for (let i = 0; i < availableQuestions.length; i++) {
        const { criteria } = availableQuestions[i];

        if (!evaluationCriteriaStats[criteria.id]) {
          evaluationCriteriaStats[criteria.id] = {
            count: 1,
            criteria
          };
        } else {
          evaluationCriteriaStats[criteria.id].count++;
        }
      }

      const evaluationCriteriasStatsSorted = Object.values(evaluationCriteriaStats);

      evaluationCriteriasStatsSorted.sort(countSort)

      setEvaluationCriterias(evaluationCriteriasStatsSorted.map(ecs => ecs.criteria))
    }
  }, [availableQuestions, type, subtype])

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
      const qFilter = [
        ['companyId', 'in', ['asker', user.companyId]],
        ['type', '==', type]
      ]

      if (subtype) {
        qFilter.push(['subtype', '==', subtype])
      }

      filterManyDocuments(
        'questions',
        qFilter,
        [['name', 'asc']]).then(setAvailableQuestions)
    }
  }, [user, type, subtype])

  const handleQuestionAdd = (q) => {
    onQuestions([
      ...questions,
      q
    ])
  }

  useEffect(() => {
    const { q, company, type: filterType } = filter;

    let filteredQuestions = availableQuestions.filter(q => {
      const notSelected = !questions.find(qs => qs.id == q.id)
      const companySelected = company.indexOf(q.companyId) > -1;
      let typeSelected;
      
      if (type == 'evaluation') {
        typeSelected = !filterType.length || filterType.find(c => q.criteria && c.id == q.criteria.id)
      } else {
        typeSelected = !filterType.length || filterType.indexOf(q.subtype) > -1
      }


      return notSelected && companySelected && typeSelected
    });

    if (q && filteredQuestions.length) {
      const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

      filteredQuestions = filteredQuestions.filter(q => {
        const { criteria } = q;

        const nameInt = i18nField(q.name)
        const criteraInt = criteria && i18nField(criteria.name) || '';

        const nameQ = regex.test(nameInt.toLowerCase());
        const criteriaQ = regex.test(criteraInt.toLowerCase());

        return nameQ || criteriaQ;
      })
    }

    setFilterdQuestions(filteredQuestions)
  }, [filter, locale, type, availableQuestions, questions])

  const handleNewQuestion = (question) => {
    if (question && question.name) {
      setAvailableQuestions([
        ...availableQuestions,
        question
      ])

      handleQuestionAdd(question)
    }
  }

  const handleCreateQuestion = () => {
    if (type == 'screening' || type == 'other') {
      openScreeningQuestionModal(handleNewQuestion, { type })
    } else {
      openEvaluationQuestionModal(handleNewQuestion, { type: subtype })
    }
  }

  const toggleFilterControl = ev => {
      setFilterControlOpen(!filterControlOpen)
  }

  useEffect(() => {
    if (!filterControlOpen) {
      return;
    }

    const handleOffClick = ev => {
      ev.stopPropagation();

      if (filterControlPopupRef && filterControlPopupRef.current && ev.target != filterControlPopupRef.current && !filterControlPopupRef.current.contains(ev.target)) {
        setFilterControlOpen(false)
      }
    }

    document.body.addEventListener('click', handleOffClick)

    return () => {
      document.body.removeEventListener('click', handleOffClick)
    }
  }, [filterControlOpen])

  return <div data-test-id="question-explorer" className={classNames(styles['question-explorer'], className)}>
  {
      label ?
      <h3 className={styles['question-explorer-title']}>{label}</h3> :
      <h3 className={styles['question-explorer-title']}>{t('Search question')}</h3>
    }

    <div className={styles['question-explorer-wrapper']}>
      <div className={styles['question-explorer-head']}>

       <div className={styles['question-explorer-control']}>
            <div className={styles['question-explorer-company-filter']}>
              <CheckboxButton theme='green' className={styles['question-explorer-company-filter-button']} checked={filter.company.indexOf('asker') > -1} onClick={() => toggleCompany('asker')}>{t('Asker questions')}</CheckboxButton>
              <CheckboxButton theme='dark' className={styles['question-explorer-company-filter-button']} checked={filter.company.indexOf(user && user.companyId) > -1} onClick={() => toggleCompany(user && user.companyId)}>{t('Your questions')}</CheckboxButton>
            </div>

            <LiveSearch className={styles['question-explorer-live-search']} q={filter.q} onQuery={q => setFilter({ ...filter, q})} />
            <CreateButton onClick={handleCreateQuestion}/>
  </div>

        {
          type == 'screening' ?
          <div data-test-id="subtype-filter" className={styles['question-explorer-type-filter']}>
            <div className={styles['question-explorer-type-filter-list']}>
              <QuestionExplorerOption className={styles['question-explorer-type-filter-option']} active={filter.type.indexOf('choice') > -1} onClick={() => toggleType('choice')}>{getScreeningQuestionLabelBySubtype('choice')}</QuestionExplorerOption>
              <QuestionExplorerOption className={styles['question-explorer-type-filter-option']} active={filter.type.indexOf('multichoice') > -1} onClick={() => toggleType('multichoice')}>{getScreeningQuestionLabelBySubtype('multichoice')}</QuestionExplorerOption>
              <QuestionExplorerOption className={styles['question-explorer-type-filter-option']} active={filter.type.indexOf('range') > -1} onClick={() => toggleType('range')}>{getScreeningQuestionLabelBySubtype('range')}</QuestionExplorerOption>
            </div>
          </div> : null
        }
        {
          type == 'other' ?
          <div data-test-id="subtype-filter" className={styles['question-explorer-type-filter']}>
            <div className={styles['question-explorer-type-filter-list']}>
              <QuestionExplorerOption className={styles['question-explorer-type-filter-option']} active={filter.type.indexOf('text') > -1} onClick={() => toggleType('text')}>{getScreeningQuestionLabelBySubtype('text')}</QuestionExplorerOption>
            </div>
          </div> : null
        }
        { type == 'evaluation' ?
          <div data-test-id="subtype-filter" className={styles['question-explorer-type-filter']}>
            <div className={styles['question-explorer-type-filter-list']}>
              {evaluationCriterias.map(ec => (
                <QuestionExplorerOption key={ec.id} className={styles['question-explorer-type-filter-option']} active={filter.type.indexOf(ec) > -1} onClick={() => toggleType(ec)}>{i18nField(ec.name)}</QuestionExplorerOption>
              ))}
            </div>

            {
              type == 'evaluation' && evaluationCriterias.length > 3 ?
              <div className={styles['question-explorer-type-filter-control']}>
                <button data-test-id="subtype-control" type="button" onClick={toggleFilterControl} className={styles['question-explorer-type-filter-control-button']}>
                  <VerticalDotsIcon className={styles['question-explorer-type-filter-control-button-icon']} />
                </button>

                {
                  filterControlOpen ?
                  <div data-test-id="subtype-popup" tabIndex="-1" ref={filterControlPopupRef} className={styles['question-explorer-type-filter-control-popup']}>
                      <LiveSelect selected={filter.type} items={evaluationCriterias} onSelect={selected => setFilter({...filter, type: selected})} />
                  </div> : null
                }
              </div> : null
            }
          </div> : null
        }
      </div>

      <div className={styles['question-explorer-body']}>
       {
        filteredQuestions.length ?
        <QuestionExplorerQuestionList className={styles['question-explorer-list']} onQuestion={handleQuestionAdd} questions={filteredQuestions} /> :
        <p className={styles['question-explorer-empty']}>{t('No questions')}</p>
        }
      </div>
    </div>
  </div>
}

export default QuestionExplorer;
