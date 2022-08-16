import classNames from 'classnames';
import { useEffect } from 'react';
import useForm from 'libs/use-form';
import QuestionExplorer from 'components/QuestionExplorer/QuestionExplorer';
import SelectedQuestionsManager from 'components/SelectedQuestionsManager/SelectedQuestionsManager';

import styles from './evaluation-question-stage-form.module.scss';
import { SHORT_IDS, SHORT_NAMES } from 'libs/stage';

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

  useEffect(() => {
    if (!errors) {
      onValues && onValues(formValues)
    } else {
      onError(new Error("Must have at leas one question."))
    }
  }, [formValues, errors])

  return <div className={classNames(styles['evaluation-question-stage-from'], className)}>
    <QuestionExplorer type={'evaluation'} subtype={SHORT_IDS[feature.id]} label={SHORT_NAMES[feature.id]} className={styles['evaluation-question-stage-form-question-explorer']} questions={formValues.questions} onQuestions={control.input('questions', false)} />
    <SelectedQuestionsManager notes={formValues.notes} onNotes={control.input('notes', false)} type={'evaluation'} subtype={SHORT_IDS[feature.id]} className={styles['evaluation-question-stage-form-question-explorer']}  questions={formValues.questions} onChange={control.input('questions', false)} />
  </div>
}

export default EvaluationQuestionStageForm;
