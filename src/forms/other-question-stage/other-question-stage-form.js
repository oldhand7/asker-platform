import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import ScreeningQuestionExplorer from 'components/ScreeningQuestionExplorer/ScreeningQuestionExplorer';
import { getCriteriaTypeById } from 'libs/criteria';
import TrashButton from 'components/TrashButton/TrashButton';
import ScreeningQuestionList from 'components/ScreeningQuestionList/ScreeningQuestionList';

import styles from './other-question-stage-form.module.scss';

const defaultValues = {
  questions: []
}

const rules = {
  questions: 'array'
}

const messages = {}

const OtherQuestionStageForm = ({ className, values, onValues, feature, onError }) => {
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

  return <div className={classNames(styles['other-question-stage-form'], className)}>
    <ScreeningQuestionExplorer label='Search other question' questions={formValues.questions} onQuestions={control.input('questions', false)} type='other' />
    <ScreeningQuestionList questions={formValues.questions} onChange={control.input('questions', false)} />
  </div>
}

export default OtherQuestionStageForm;
