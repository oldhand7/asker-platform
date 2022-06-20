import classNames from 'classnames';
import ProgressBar from 'components/ProgressBar/ProgressBar';

import styles from './EvaluationScoreBar.module.scss';

const EvaluationScoreBar = ({ className, value = 0, color = '#CCC' }) => {

  return <div data-test-id="evaluation-score-bar" className={classNames(styles['evaluation-score-bar'], className)} style={{color}}>
    <ProgressBar p={value} color={color} className={styles['evaluation-score-bar-graph']} />
    <div className={styles['evaluation-score-bar-value-container']}>
      <span className={styles['evaluation-score-bar-value']}>{value}%</span>
    </div>
  </div>
}

export default EvaluationScoreBar;
