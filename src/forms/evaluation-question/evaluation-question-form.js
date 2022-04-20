import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import EvaluationQuestionExplorer from 'components/EvaluationQuestionExplorer/EvaluationQuestionExplorer';
import { getCriteriaById } from 'libs/criteria';
import TrashButton from 'components/TrashButton/TrashButton';

import styles from './evaluation-question-form.module.scss';

const defaultValues = {
  questions: []
}

const rules = {
  questions: 'array'
}

const messages = {}

//@TODO: rename to criteria
const EvaluationQuestionForm = ({ className, values, onValues, feature, onError }) => {
  const [formValues, errors, control] = useForm({
    values: values ? values : defaultValues,
    rules,
    messages,
    pristine: false
  })

  const handleQuestionRemove = question => {
    if (confirm('Are you sure?')) {
      control.set('questions', [...formValues.questions.filter(q => q != question)])
    }
  }

  useEffect(() => {
    if (!errors) {
      onValues && onValues(formValues)
    } else {
      onError(new Error("Form invalid"))
    }
  }, [formValues, errors])

  return <div className={classNames(styles['evaluation-question-from'], className)}>
    <EvaluationQuestionExplorer questions={formValues.questions} onQuestions={control.input('questions', false)} criteria={getCriteriaById(feature && feature.metadata.criteria)} />
    <div className={styles['evaluation-question-form-questions']}>
      <h3>Selected questions</h3>

      <ul className={styles['evaluation-question-form-questions-list']}>
        {formValues.questions.map(q => (
          <li className={styles['evaluation-question-form-questions-list']}>
            <span className={styles['evaluation-question-form-questions-list-item-name']}>{q.name}</span>
            <TrashButton className={styles['evaluation-question-form-questions-list-item-remove']} onClick={() => handleQuestionRemove(q)} />
          </li>
        ))}
      </ul>

      {!formValues.questions.length ? <p>No questions yet.</p> : null}
    </div>
  </div>
}

export default EvaluationQuestionForm;
