import classNames from 'classnames';
import EvaluationScoreBar from 'components/EvaluationScoreBar/EvaluationScoreBar';
import { COLOR_MAP} from 'libs/config';
import InterviewDetailsRow from './InterviewDetailsRow';
import CriteriaRating from 'components/CriteriaRating/CriteriaRating';

import styles from './InterviewDetailsRow.module.scss'

const InterviewDetailsRowEvaluation = ({ className, evaluation, ...props }) => (
  <InterviewDetailsRow
  name={evaluation.name}
  head={evaluation.score ? <EvaluationScoreBar value={evaluation.score} color={COLOR_MAP[evaluation.type]} /> : null}
  className={classNames(styles['interview-details-row-evaluation'], className)}>{
  evaluation.children ?
  <ul className={styles['interview-details-row-list']}>
    {evaluation.children.map(c => {
      return <li key={c.id} data-test-id="interview-evaluation" className={styles['interview-details-row-criteria']}>
        <span className={styles['interview-details-row-criteria-name']}>
          {c.name}
        </span>
        <CriteriaRating className={styles['interview-details-row-criteria-value']} value={c.score} color={COLOR_MAP[evaluation.type]} />
      </li>
    })}
  </ul> : null}</InterviewDetailsRow>
)

export default InterviewDetailsRowEvaluation;
