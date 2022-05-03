import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import EvaluationQuestionIntForm from 'forms/evaluation-question-int/evaluation-question-int-form'
import NextButton from 'components/Button/NextButton';
import { handleNext } from 'libs/helper';

import styles from './evaluation-questions-multiple-form.module.scss';

const rules = {}
const messages = {}

const EvaluationQuestionsMultipleForm = ({ last = false, nextId = null, index = 0, className, stage, project, values, onValues, onError }) => {
  const [formValues, errors, control] = useForm({
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


  return <div className={classNames(styles['evaluation-questions-multiples'], className)}>
    {project.config[stage.id].questions.map((q, _index) => (
      <div key={q.id}  id={`${stage.id}-${index}-${_index}`} className={styles['evaluation-questions-multiple-question']}>
        <EvaluationQuestionIntForm key={q.id} question={q} className={styles['evaluation-questions-multiple-question']} values={formValues[q.id]} onValues={control.input(q.id, false)} />
        {
          _index < project.config[stage.id].questions.length - 1 || !last ?
          <NextButton
            onClick={() => handleNext(
              _index == project.config[stage.id].questions.length - 1 ?
              nextId : `${stage.id}-${index}-${_index+1}`
            )}
            className={styles['evaluation-questions-multiple-question-next']} /> :
          null
        }
      </div>
    ))}
  </div>
}

export default EvaluationQuestionsMultipleForm;
