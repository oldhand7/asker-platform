import classNames from 'classnames';
import InterviewDetailsRow from './InterviewDetailsRow';
import styles from './InterviewDetailsRow.module.scss'
import ScreeningEvaluationLabel from 'components/ScreeningEvaluationLabel/ScreeningEvaluationLabel';

import { useMemo, useState } from 'react';

const InterviewDetailsRowEvaluation = ({ className, evaluations = [], other = false, ...props }) => {
  const singleChoiceEvaluation = useMemo(() => evaluations.find(e => e.question.subtype == 'choice'), [evaluations])
  const cleanEvaluations = useMemo(() => evaluations.filter(e => e != singleChoiceEvaluation), [evaluations, singleChoiceEvaluation])

  return <InterviewDetailsRow
  name={other ? 'Other' : 'Screening'}
  className={classNames(styles['interview-details-row-screening'], className)}
  head={singleChoiceEvaluation ? <ScreeningEvaluationLabel className={styles['interview-details-row-crit']} evaluation={singleChoiceEvaluation} /> : null}
  >{cleanEvaluations.length ? <ul className={styles['interview-details-row-list']}>
    {cleanEvaluations.map(e => {
      return <li key={e.question.id} className={classNames(
        styles['interview-details-row-list-item'],
        styles[`interview-details-row-list-item-${e.question.type}`],
        styles[`interview-details-row-list-item-${e.question.subtype}`]
      )}><ScreeningEvaluationLabel className={styles['interview-details-row-crit']} evaluation={e} /></li>
    })}
  </ul> : null}</InterviewDetailsRow>
}

export default InterviewDetailsRowEvaluation;
