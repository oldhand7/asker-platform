import classNames from 'classnames';
import { useEffect } from 'react';
import {useForm} from 'libs/form';
import EvaluationQuestionIntForm from 'forms/evaluation-question-int/evaluation-question-int-form'
import NextButton from 'components/Button/NextButton';
import { handleNext } from 'libs/helper';
import InterviewStageTimeLabel from 'components/InterviewStageTimeLabel/InterviewStageTimeLabel';

import styles from './evaluation-questions-multiple-form.module.scss';
import { getStageKey } from 'libs/stage';

const rules = {}
const messages = {}

const EvaluationQuestionsMultipleForm = ({ last = false, nextId = null, taxStageSecond, index = 0, className, markComplete, stage, values, onValues, onError }) => {
  const { values: formValues, errors, control } = useForm({
    values,
    rules,
    messages
  })

  useEffect(() => {
    if (!errors) {
      onValues && onValues(formValues)
    } else {
      onError(new Error('Some fields not valid'))
    }
  }, [formValues])


  return <div className={styles['evaluation-questions-multiple']}>
    {stage.config.questions.map((q, _index) => (
      <div data-test-id="evaluation-question-int" key={q.id}  id={`stage-${getStageKey(stage)}-${q.id}`} className={classNames(
        styles['evaluation-questions-multiple-question'],
        className
      )}>
        <InterviewStageTimeLabel className={styles['evaluation-questions-multiple-timer']} time={stage.time || DEFAULT_STAGE_TIME} /> 
        <EvaluationQuestionIntForm taxStageSecond={taxStageSecond} markComplete={markComplete} key={q.id} question={q} className={styles['evaluation-questions-multiple-question-form']} values={formValues[q.id]} onValues={control.input(q.id, false)} />
        {
          _index < stage.config.questions.length - 1 || !last ?
          <NextButton
            onClick={() => {
              const voted = formValues[q.id].votes.some(v => v.head)

              if (voted) {
                markComplete(q.id)
              }

              handleNext(
                _index == stage.config.questions.length - 1 ?
                nextId : `stage-${getStageKey(stage)}-${stage.config.questions[_index+1].id}`
              )
            }}
            className={styles['evaluation-questions-multiple-question-next']} /> :
          null
        }
      </div>
    ))}
  </div>
}

export default EvaluationQuestionsMultipleForm;
