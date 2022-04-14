import ReactStars from 'react-stars'
import classNames from 'classnames';

import styles from './EvaluationScore.module.scss';

const EvaluationScore = ({ className, score = 0}) => {
  //@TODO; score adjustment
  return <div className={classNames(styles['evaluation-score'], className)}>
    <span className={styles['evaluation-score-title']}></span>
    <ReactStars count={4}  size={24} color2={'#ffd700'} className={styles['evaluation-score-stars']} />
  </div>
}

export default EvaluationScore;
