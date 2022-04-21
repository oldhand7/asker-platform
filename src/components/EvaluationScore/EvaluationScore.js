import ReactStars from 'react-stars'
import classNames from 'classnames';

import styles from './EvaluationScore.module.scss';

const EvaluationScore = ({ className, evaluation}) => {
  return <div className={classNames(styles['evaluation-score'], className)}>
    <span className={styles['evaluation-score-title']}>{evaluation.criteria.name}</span>
    <ReactStars value={evaluation.score} count={evaluation.maxScore} edit={false}  size={24} color2={'#ffd700'} className={styles['evaluation-score-stars']} />
  </div>
}

export default EvaluationScore;
