import classNames from 'classnames';
import {useForm} from 'libs/react-hook-form';
import { useEffect, useMemo } from 'react';
import TextQuestionIntForm from 'forms/text-question-int/text-question-int-form';
import { useTranslation } from 'libs/translation';
import { useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';

import styles from './other-questions-int-form.module.scss';

const questionForms = {
  'text': TextQuestionIntForm
}

const validationRules = {
  errors: 'errorsEmpty'
}

const OtherQuestionsIntForm = ({ className, values, onValues, config, onError }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const initValues = useMemo(() => ({
    answers: values || {},
    errors: {}
  }), [])

  const validationMessages = useMemo(() => ({
    'errorsEmpty': t('errors.answers.invalid')
  }), [locale])

  const {
    control,
    setValue
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  })

  const formValues = useWatch({ control, defaultValue: initValues})

  const answers = useWatch({
    control,
    name: 'answers',
    defaultValue: initValues
  })

  const errors = useWatch({
    control,
    name: 'errors',
    defaultValue: {}
  })

  useEffect(() => {
    onValues && onValues(answers)
  }, [answers, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  const valueHandlers = useMemo(() => {
    const handlers = {}

    for (let i = 0; i < config.questions.length; i++) {
      const { id } = config.questions[i];

      handlers[id] = val => setValue(`answers.${id}`, val)
    }

    return handlers;
  }, [setValue, config.questions])

  const errorHandlers = useMemo(() => {
    const handlers = {}

    for (let i = 0; i < config.questions.length; i++) {
      const { id } = config.questions[i];

      handlers[id] = error => setValue(`errors.${id}`, error)
    }

    return handlers;
  }, [setValue, config.questions])

  return <div className={classNames(styles['other-questions-int-form'], className)}>
    <div className={styles['other-questions-int-form-questions']}>
    {config.questions
      .map(q => {
        const QuestionFormCompnent = questionForms[q.subtype];

        if (!QuestionFormCompnent) {
          return null;
        }

        return <div data-test-id="other-question-int" key={q.id} className={styles['other-questions-int-form-question']}>
          <h4 className={styles['other-questions-int-form-question-title']}>{t('stages.other-questions.name-singular')}</h4>
          <QuestionFormCompnent className={styles['other-questions-int-form-question-form']} question={q} onError={errorHandlers[q.id]} values={formValues.answers[q.id]} onValues={valueHandlers[q.id]} />
        </div>
      })
    }
    </div>
  </div>
}

export default OtherQuestionsIntForm;
