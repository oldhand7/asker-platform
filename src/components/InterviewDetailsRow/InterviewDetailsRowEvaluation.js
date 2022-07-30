import classNames from 'classnames';
import EvaluationScoreBar from 'components/EvaluationScoreBar/EvaluationScoreBar';
import { COLOR_MAP} from 'libs/config';
import InterviewDetailsRow from './InterviewDetailsRow';
import CriteriaRating from 'components/CriteriaRating/CriteriaRating';
import { useSite } from 'libs/site';

import styles from './InterviewDetailsRow.module.scss'

export const List = ({ evaluation }) => {
  const { i18nField } = useSite();

return <ul className={styles['interview-details-row-list']}>
{evaluation.children.map(c => {
  return <li key={c.id} data-test-id="interview-evaluation" className={styles['interview-details-row-criteria']}>
    <span className={styles['interview-details-row-criteria-name']}>
      {i18nField(c.name)}
    </span>
    <CriteriaRating className={styles['interview-details-row-criteria-value']} value={c.score} color={COLOR_MAP[evaluation.type]} />
  </li>
})}
</ul>
}

const InterviewDetailsRowEvaluation = ({ className, evaluation, ...props }) => (
  <InterviewDetailsRow
  name={evaluation.name}
  head={evaluation.score ? <EvaluationScoreBar value={evaluation.score} color={COLOR_MAP[evaluation.type]} /> : null}
  className={classNames(styles['interview-details-row-evaluation'], className)}>{
  evaluation.children ? <List evaluation={evaluation} />  : null}</InterviewDetailsRow>
)

export default InterviewDetailsRowEvaluation;
