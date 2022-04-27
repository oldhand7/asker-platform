import classNames from 'classnames';
import ChoiceQuestionIntForm from 'forms/choice-question-int/choice-question-int-form';
import useForm from 'libs/use-form';
import NextButton from 'components/Button/NextButton';
import { useEffect } from 'react';
import MultichoiceQuestionIntForm from 'forms/multichoice-question-int/multichoice-question-int-form';
import RangeQuestionIntForm from 'forms/range-question-int/range-question-int-form';
import TextQuestionIntForm from 'forms/text-question-int/text-question-int-form';

import styles from './screening-questions-int-form.module.scss';

const questionForms = {
  'choice': ChoiceQuestionIntForm,
  'multichoice': MultichoiceQuestionIntForm,
  'range': RangeQuestionIntForm,
  'text': TextQuestionIntForm
}

const rules = {}

const ScreeningQuestionsIntForm = ({ last = false, className, values, onValues, config }) => {
  const [formValues, errors, control] = useForm({
    values,
    rules
  })

  useEffect(() => {
    onValues(formValues)
  }, [formValues])

  return <div className={classNames(styles['screening-questions-int-form'], className)}>
    {config.questions
      .map(q => {
        const QuestionFormCompnent = questionForms[q.subtype];

        if (!QuestionFormCompnent) {
          return null;
        }

        return <div data-test-id="screening-question-int" key={q.id} className={styles['screening-questions-int-form-question']}>
          <h4 className={styles['screening-questions-int-form-question-title']}>Screening question</h4>
          <QuestionFormCompnent className={styles['screening-questions-int-form-question-form']}  question={q}  values={formValues[q.id]} onValues={control.input(q.id, false)} />
        </div>
      })
    }

    {!last ? <NextButton className={styles['screening-questions-int-form-submit']}  /> : null}
  </div>
}

export default ScreeningQuestionsIntForm;
