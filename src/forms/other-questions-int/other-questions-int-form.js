import classNames from 'classnames';
import {useForm} from 'libs/form';
import { useEffect } from 'react';
import TextQuestionIntForm from 'forms/text-question-int/text-question-int-form';
import styles from './other-questions-int-form.module.scss';
import { useSite } from 'libs/site';

const questionForms = {
  'text': TextQuestionIntForm
}

const rules = {}

const OtherQuestionsIntForm = ({ className, markComplete, values, inView, onValues, config }) => {
  const { t } = useSite();

  const { values: formValues, control } = useForm({
    values,
    rules
  })

  useEffect(() => {
    onValues(formValues)
  }, [formValues])


  useEffect(() => {
    if (inView) {
      markComplete();
    }
  }, [inView])

  return <div className={classNames(styles['other-questions-int-form'], className)}>
    <div className={styles['other-questions-int-form-questions']}>
    {config.questions
      .map(q => {
        const QuestionFormCompnent = questionForms[q.subtype];

        if (!QuestionFormCompnent) {
          return null;
        }

        return <div data-test-id="other-question-int" key={q.id} className={styles['other-questions-int-form-question']}>
          <h4 className={styles['other-questions-int-form-question-title']}>{t('Other question')}</h4>
          <QuestionFormCompnent className={styles['other-questions-int-form-question-form']}  question={q}  values={formValues[q.id]} onValues={control.input(q.id, false)} />
        </div>
      })
    }
    </div>
  </div>
}

export default OtherQuestionsIntForm;
