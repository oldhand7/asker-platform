import classNames from 'classnames';
import PillLabel from 'components/PillLabel/PillLabel';
import { getAnswerColor } from 'libs/answers';
import { useSite } from 'libs/site';

import styles from './ScreeningEvaluationLabel.module.scss';

const ScreeningEvaluationLabel = ({ evaluation, className }) => {
    const { question, answer } = evaluation;
    const { i18nField } = useSite();

    return <div className={classNames(
        styles['screening-evaluation-label'],
        styles[`screening-evaluation-label-${question.type}`],
        styles[`screening-evaluation-label-${question.subtype}`],
        className
    )}>
        <span className={styles['screening-evaluation-label-name']}>
          {i18nField(question.name)}
        </span>

        {question.subtype == 'choice' || question.subtype == 'multichoice'  ?
        <span className={styles['screening-evaluation-label-value']}>
          {answer.map((a, index) => {
            let answerText;

            if (typeof a === 'object') {
              answerText = i18nField(a.name)
            } else {
              answerText = a;
            }

           return <PillLabel key={`a${index}`} className={styles['screening-evaluation-label-pill']}  text={answerText} color={getAnswerColor(a)} />
          })}
        </span> : null}

        {question.subtype == 'range' ?
        <span className={styles['screening-evaluation-label-value']}>
          <PillLabel className={styles['screening-evaluation-label-pill']} text={`${answer[0]} ${question.unit}`} /> - <PillLabel  className={styles['screening-evaluation-label-pill']}  text={`${answer[1]} ${question.unit}`} />
        </span> : null}
    </div>
}

export default ScreeningEvaluationLabel;