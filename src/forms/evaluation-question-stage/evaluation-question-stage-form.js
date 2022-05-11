import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import EvaluationQuestionExplorer from 'components/EvaluationQuestionExplorer/EvaluationQuestionExplorer';
import { getCriteriaTypeById } from 'libs/criteria';
import SelectedQuestionsList from 'components/SelectedQuestionsList/SelectedQuestionsList';

import styles from './evaluation-question-stage-form.module.scss';

const defaultValues = {
  questions: []
}

const rules = {
  questions: 'array'
}

const messages = {

}

const EvaluationQuestionStageForm = ({ className, values, onValues, feature, onError }) => {
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
      onError(new Error("Must have at leas one question."))
    }
  }, [formValues, errors])

  return <div className={classNames(styles['evaluation-question-from'], className)}>
    <EvaluationQuestionExplorer questions={formValues.questions} onQuestions={control.input('questions', false)} criteria={getCriteriaTypeById(feature && feature.metadata.criteria)} />
    <SelectedQuestionsList feature={feature} questions={formValues.questions} onChange={control.input('questions', false)} />
  </div>
}

export default EvaluationQuestionStageForm;
