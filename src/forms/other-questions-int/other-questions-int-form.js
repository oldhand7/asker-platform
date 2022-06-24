import classNames from 'classnames';
import ChoiceQuestionIntForm from 'forms/choice-question-int/choice-question-int-form';
import {useForm} from 'libs/form';
import { useEffect } from 'react';
import MultichoiceQuestionIntForm from 'forms/multichoice-question-int/multichoice-question-int-form';
import RangeQuestionIntForm from 'forms/range-question-int/range-question-int-form';
import TextQuestionIntForm from 'forms/text-question-int/text-question-int-form';
import styles from './other-questions-int-form.module.scss';

const questionForms = {
  'choice': ChoiceQuestionIntForm,
  'multichoice': MultichoiceQuestionIntForm,
  'range': RangeQuestionIntForm,
  'text': TextQuestionIntForm
}

const rules = {}

const OtherQuestionsIntForm = ({ className, markComplete, values, onValues, config }) => {
  const { values: formValues, control } = useForm({
    values,
    rules
  })

  useEffect(() => {
    onValues(formValues)
  }, [formValues])

  useEffect(() => {
    if (!config || !config.questions) {
      return;
    }

    const complete = config.questions.every(q => formValues[q.id])

    if (complete) {
      markComplete();
    }
  }, [formValues, config])

  return <div className={classNames(styles['other-questions-int-form'], className)}>
    <div className={styles['other-questions-int-form-questions']}>
    {config.questions
      .map(q => {
        const QuestionFormCompnent = questionForms[q.subtype];

        if (!QuestionFormCompnent) {
          return null;
        }

        return <div data-test-id="other-question-int" key={q.id} className={styles['other-questions-int-form-question']}>
          <h4 className={styles['other-questions-int-form-question-title']}>Other question</h4>
          <QuestionFormCompnent className={styles['other-questions-int-form-question-form']}  question={q}  values={formValues[q.id]} onValues={control.input(q.id, false)} />
        </div>
      })
    }
    </div>
  </div>
}

export default OtherQuestionsIntForm;
