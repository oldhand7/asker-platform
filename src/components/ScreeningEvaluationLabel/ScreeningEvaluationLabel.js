import classNames from 'classnames';
import PillLabel from 'components/PillLabel/PillLabel';
import { getAnswerColor } from 'libs/answers';

import styles from './ScreeningEvaluationLabel.module.scss';

const ScreeningEvaluationLabel = ({ evaluation, className }) => {
    const { question, answer } = evaluation;

    return <div className={classNames(
        styles['screening-evaluation-label'],
        styles[`screening-evaluation-label-${question.type}`],
        styles[`screening-evaluation-label-${question.subtype}`],
        className
    )}>
        <span className={styles['screening-evaluation-label-name']}>
          {question.name}
        </span>

        {question.subtype == 'choice' || question.subtype == 'multichoice'  ?
        <span className={styles['screening-evaluation-label-value']}>
          {answer.map((a, index) =>
            <PillLabel key={`a${index}`} className={styles['screening-evaluation-label-pill']}  text={a} color={getAnswerColor(a)} />
          )}
        </span> : null}

        {question.subtype == 'range' ?
        <span className={styles['screening-evaluation-label-value']}>
          between <PillLabel className={styles['screening-evaluation-label-pill']} text={`${answer[0]} ${question.unit}`} />  and <PillLabel  className={styles['screening-evaluation-label-pill']}  text={`${answer[1]} ${question.unit}`} />
        </span> : null}

        {question.subtype == 'text' ?
        <span className={styles['screening-evaluation-label-value']}>
           <PillLabel wrap={true} className={styles['screening-evaluation-label-pill']}>
            <div dangerouslySetInnerHTML={{__html: answer[0]}}></div>
           </PillLabel>
        </span> : null}
    </div>
}

export default ScreeningEvaluationLabel;