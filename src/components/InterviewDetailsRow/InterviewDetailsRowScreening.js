import classNames from 'classnames';
import EvaluationScoreBar from 'components/EvaluationScoreBar/EvaluationScoreBar';
import { COLOR_MAP} from 'libs/config';
import InterviewDetailsRow from './InterviewDetailsRow';
import PillLabel from 'components/PillLabel/PillLabel';
import striptags from 'striptags';

import styles from './InterviewDetailsRow.module.scss'

const getAnswerColor = answer => {
  if (answer.toLowerCase() == 'no') {
    return 'red';
  }

  if (answer.toLowerCase() == 'yes') {
    return 'green';
  }

  return 'inherit';
}

const InterviewDetailsRowEvaluation = ({ className, evaluations = [], other = false, ...props }) => (
  <InterviewDetailsRow
  name={other ? 'Other' : 'Screening'}
  className={classNames(styles['interview-details-row-screening'], className)}>
  <ul className={styles['interview-details-row-list']}>
    {evaluations.map(({ question, answer }) => {
      return <li key={question.id} className={classNames(
        styles['interview-details-row-criteria'],
        styles[`interview-details-row-criteria-${question.type}`],
        styles[`interview-details-row-criteria-${question.subtype}`]
      )}>
        <span className={styles['interview-details-row-criteria-name']}>
          {question.name}
        </span>

        {question.subtype == 'choice' || question.subtype == 'multichoice'  ?
        <span className={styles['interview-details-row-criteria-value']}>
          {answer.map((a, index) =>
            <PillLabel key={`a${index}`} className={styles['interview-details-row-criteria-pill']}  text={a} color={getAnswerColor(a)} />
          )}
        </span> : null}

        {question.subtype == 'range' ?
        <span className={styles['interview-details-row-criteria-value']}>
          between <PillLabel className={styles['interview-details-row-criteria-pill']} text={`${answer[0]} ${question.unit}`} />  and <PillLabel  className={styles['interview-details-row-criteria-pill']}  text={`${answer[1]} ${question.unit}`} />
        </span> : null}

        {question.subtype == 'text' ?
        <span className={styles['interview-details-row-criteria-value']}>
           <PillLabel wrap={true} className={styles['interview-details-row-criteria-pill']}>
            <div dangerouslySetInnerHTML={{__html: answer[0]}}></div>
           </PillLabel>
        </span> : null}
      </li>
    })}
  </ul>
  </InterviewDetailsRow>
)

export default InterviewDetailsRowEvaluation;
