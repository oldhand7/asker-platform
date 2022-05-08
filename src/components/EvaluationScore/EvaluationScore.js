import ReactStars from 'react-stars'
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { ucFirst, getSubtype } from 'libs/helper';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';

import styles from './EvaluationScore.module.scss';

const EvaluationScore = ({ className, evaluation}) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const subtype = getSubtype(evaluation);

    if (subtype) {
      if (EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(subtype) == -1) {
        setLabel(evaluation.criteria && evaluation.criteria.name || ucFirst(subtype));
      } else {
        setLabel(ucFirst(subtype));
      }
    }
  }, [evaluation])

  return label ? <div data-test-id="evaluation-score" data-score={evaluation.score} className={classNames(styles['evaluation-score'], className)}>
    <span className={styles['evaluation-score-title']}>{label}</span>
    <ReactStars value={evaluation.score} count={evaluation.maxScore} edit={false}  size={24} color2={'#ffd700'} className={styles['evaluation-score-stars']} />
  </div> : null
}

export default EvaluationScore;
