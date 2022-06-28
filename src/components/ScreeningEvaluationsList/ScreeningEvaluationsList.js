import classNames from 'classnames';
import PillLabel from 'components/PillLabel/PillLabel';
import { getAnswerColor } from 'libs/answers';

import styles from './ScreeningEvaluationsList.module.scss';

const ScreeningEvaluationsList = ({ className, evaluations = []}) => {
    return <ul className={classNames(
        styles['screening-evaluations-list'],
        className
    )}>
    {evaluations.map(({ question, answer }) => {
      return <li key={question.id} className={classNames(
        styles['screening-evaluations-list-criteria'],
        styles[`screening-evaluations-list-criteria-${question.type}`],
        styles[`screening-evaluations-list-criteria-${question.subtype}`]
      )}>
        <span className={styles['screening-evaluations-list-criteria-name']}>
          {question.name}
        </span>
    
        {question.subtype == 'choice' || question.subtype == 'multichoice'  ?
        <span className={styles['screening-evaluations-list-criteria-value']}>
          {answer.map((a, index) =>
            <PillLabel key={`a${index}`} className={styles['screening-evaluations-list-criteria-pill']}  text={a} color={getAnswerColor(a)} />
          )}
        </span> : null}
    
        {question.subtype == 'range' ?
        <span className={styles['screening-evaluations-list-criteria-value']}>
          between <PillLabel className={styles['screening-evaluations-list-criteria-pill']} text={`${answer[0]} ${question.unit}`} />  and <PillLabel  className={styles['screening-evaluations-list-criteria-pill']}  text={`${answer[1]} ${question.unit}`} />
        </span> : null}
    
        {question.subtype == 'text' ?
        <span className={styles['screening-evaluations-list-criteria-value']}>
           <PillLabel wrap={true} className={styles['screening-evaluations-list-criteria-pill']}>
            <div dangerouslySetInnerHTML={{__html: answer[0]}}></div>
           </PillLabel>
        </span> : null}
      </li>
    })}
    </ul>
}

export default ScreeningEvaluationsList;