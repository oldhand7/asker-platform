import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import QuestionExplorer from 'components/QuestionExplorer/QuestionExplorer';
import SelectedQuestionsManager from 'components/SelectedQuestionsManager/SelectedQuestionsManager';

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

  useEffect(() => {
    if (!errors) {
      onValues && onValues(formValues)
    } else {
      onError(new Error("Form invalid"))
    }
  }, [formValues, errors])

  return <div className={classNames(styles['screening-question-stage-form'], className)}>
    <QuestionExplorer className={styles['screening-question-stage-form-question-explorer']} label='Screening' questions={formValues.questions} onQuestions={control.input('questions', false)} type='screening' />
    <SelectedQuestionsManager className={styles['screening-question-stage-form-question-manager']} questions={formValues.questions} onChange={control.input('questions', false)} type='screening' />
  </div>
}

export default ScreeningQuestionStageForm;
