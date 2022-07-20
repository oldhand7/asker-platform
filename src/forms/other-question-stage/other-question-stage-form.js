import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import QuestionExplorer from 'components/QuestionExplorer/QuestionExplorer';
import SelectedQuestionsManager from 'components/SelectedQuestionsManager/SelectedQuestionsManager';

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

  useEffect(() => {
    if (!errors) {
      onValues && onValues(formValues)
    } else {
      onError(new Error("Form invalid"))
    }
  }, [formValues, errors])

  return <div className={classNames(styles['other-question-stage-form'], className)}>
    <QuestionExplorer className={styles['other-question-stage-form-question-explorer']} label='Other' questions={formValues.questions} onQuestions={control.input('questions', false)} type='other' />
    <SelectedQuestionsManager className={styles['other-question-stage-form-question-manager']} feature={feature} questions={formValues.questions} onChange={control.input('questions', false)} type='other' />
  </div>
}

export default OtherQuestionStageForm;
