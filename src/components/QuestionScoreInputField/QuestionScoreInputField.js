import RuleInputField from 'components/RuleInputField/RuleInputField';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'libs/react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import { createRule } from 'components/RuleInputField/RuleInputField';

import styles from './QuestionScoreInputField.module.scss'

const createDemoRules = () => ([
  createRule('Basic', 3),
  createRule('Advanced', 3),
  createRule('Professional', 3),
  createRule('Expert', 3)
])

const QuestionScoreInputField = ({ className='', rules, onChange }) => {
  const { t } = useTranslation();

  const initValues = useMemo(() => ({ rules: rules || createDemoRules() }), [])
  
  const {
    control
  } = useForm({
    values: initValues
  })

  const { fields: scoreRules, update: updateRule } = useFieldArray({
    control,
    name: 'rules',
    keyName: '_id'
  })

  useEffect(() => {
    onChange && onChange(scoreRules)
  }, [scoreRules, onChange])

  const inputHandlers = useMemo(() => {
    return scoreRules.map((_, index) => (
      rule => {
        updateRule(index, rule)
      }
    ))
  }, [updateRule])

  return <div data-test-id="question-score-input-field" className={classNames(styles['question-score-input-field'], className)}>
    <span className={styles['question-score-input-field-label']}>{t('labels.score')}</span>
    <ul className={styles['question-score-input-field-rules']}>
      {scoreRules.map((rule, index) => <li className={styles['question-score-input-field-rules-item']} key={index}>
        <RuleInputField index={index} rule={rule} onChange={inputHandlers[index]} className={styles['question-score-input-field-rules-input']} />
      </li>)}
    </ul>
  </div>
}

export default QuestionScoreInputField;
