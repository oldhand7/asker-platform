import ReactStars from 'react-stars'
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { ucFirst, getSubtype } from 'libs/helper';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';

import styles from './EvaluationScore.module.scss';

const EvaluationScore = ({ className, evaluation}) => {
  return <div data-test-id="evaluation-score" data-score={Math.round(evaluation.score)} className={classNames(styles['evaluation-score'], className)}>
    <span className={styles['evaluation-score-title']}>{evaluation.name}</span>
    <ReactStars value={Math.round(evaluation.score)} count={5} edit={false}  size={24} color2={'#ffd700'} className={styles['evaluation-score-stars']} />
  </div>
}

export default EvaluationScore;
