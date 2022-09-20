import classNames from 'classnames';
import ChoiceQuestionIntForm from 'forms/choice-question-int/choice-question-int-form';
import {useForm} from 'libs/react-hook-form';
import { useEffect, useMemo } from 'react';
import MultichoiceQuestionIntForm from 'forms/multichoice-question-int/multichoice-question-int-form';
import RangeQuestionIntForm from 'forms/range-question-int/range-question-int-form';
import TextQuestionIntForm from 'forms/text-question-int/text-question-int-form';
import { useTranslation } from 'libs/translation';
import { useWatch } from 'react-hook-form';

import styles from './screening-questions-int-form.module.scss';

const questionForms = {
  'choice': ChoiceQuestionIntForm,
  'multichoice': MultichoiceQuestionIntForm,
  'range': RangeQuestionIntForm,
  'text': TextQuestionIntForm
}

const ScreeningQuestionsIntForm = ({ markComplete, className, values, onValues, onError, config }) => {
  const { t } = useTranslation();

  const initValues = useMemo(() => values || {}, [])

  const {
    errors,
    control,
    setValue
  } = useForm({
    values: initValues
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  useEffect(() => {
    if (!config || !config.questions) {
      return;
    }

    const complete = config.questions.every(q => {
      //Consider text questions complete if they are among many
      return formValues[q.id] || (config.questions.length > 1 && q.subtype == 'text')
    })

    if (complete) {
      markComplete();
    }
  }, [formValues, config])

  const valueHandlers = useMemo(() => {
    const handlers = {};

    for (let i = 0; i < config.questions.length; i++) {
      const { id } = config.questions[i];

      handlers[id] = val => setValue(id, val)
    }

    return handlers;
  }, [config.questions, setValue])

  return <div className={classNames(styles['form'], className)}>
    <div className={styles['form-questions']}>
    {config.questions
      .map(q => {
        const QuestionFormCompnent = questionForms[q.subtype];

        if (!QuestionFormCompnent) {
          return null;
        }

        return <div data-test-id="screening-question-int" key={q.id} className={styles['form-question']}>
          <h4 className={styles['form-question-title']}>{t('stages.screening-questions.name-singular')}</h4>
          <QuestionFormCompnent className={styles['form-question-form']}  question={q}  values={formValues[q.id]} onValues={valueHandlers[q.id]} />
        </div>
      })
    }
    </div>
  </div>
}

export default ScreeningQuestionsIntForm;
