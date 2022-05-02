import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import ScreeningQuestionExplorer from 'components/ScreeningQuestionExplorer/ScreeningQuestionExplorer';
import { getCriteriaTypeById } from 'libs/criteria';
import TrashButton from 'components/TrashButton/TrashButton';
import SelectedQuestionsList from 'components/SelectedQuestionsList/SelectedQuestionsList';

import styles from './screening-question-stage-form.module.scss';

const defaultValues = {
  questions: []
}

const rules = {
  questions: 'array'
}

const messages = {}

const ScreeningQuestionStageForm = ({ className, values, onValues, feature, onError }) => {
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

  return <div className={classNames(styles['screening-question-stage-form'], className)}>
    <ScreeningQuestionExplorer label='Search screening question' questions={formValues.questions} onQuestions={control.input('questions', false)} type='screening' />
    <SelectedQuestionsList questions={formValues.questions} onChange={control.input('questions', false)} />
  </div>
}

export default ScreeningQuestionStageForm;
