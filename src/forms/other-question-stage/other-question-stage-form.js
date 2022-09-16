import classNames from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import {useForm} from 'libs/react-hook-form';
import QuestionExplorer from 'components/QuestionExplorer/QuestionExplorer';
import SelectedQuestionsManager from 'components/SelectedQuestionsManager/SelectedQuestionsManager';
import TimedTitle from 'components/TimedTitle/TimedTitle';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import { DEFAULT_QUESTION_TIME, DEFAULT_STAGE_TIME } from 'libs/config';

import styles from './other-question-stage-form.module.scss';

const defaultValues = {
  questions: [],
  time: DEFAULT_STAGE_TIME,
  questionsTimetable: {},
  notes: {}
}

const validationRules = {
  questions: 'array',
}

const OtherQuestionStageForm = ({ className, values, onValues, feature, onError, isSubmitted }) => {
  const { t } = useTranslation();

  const initValues = useMemo(() => values || defaultValues, [])

  const {
    errors,
    setValue,
    control
  } = useForm({
    values: initValues,
    rules: validationRules
  })

  const formValues = useWatch({ control, defaultValue: initValues })
  const questionsTimetable = useWatch({ control, name: 'questionsTimetable', defaultValue: initValues.questionsTimetable })
  const questions = useWatch({ control, name: 'questions', defaultValue: initValues.questions })

  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, questionsTimetable, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  const questionsHandler = useCallback((questions) => {
    setValue('questions', questions)
  }, [setValue])

  const handleQuestionNote = useCallback((q, note) => {
    console.count('handleQuestionNote')

    setValue(`notes.${q.id}`, note)
  }, [setValue])

  const handleQuestionTime = useCallback((q, time) => {
    setValue(`questionsTimetable.${q.id}`, time)
  }, [setValue])

  useEffect(() => {
    if (questions.length) {
      const time = questions.reduce((sum, q) => {
        const qt = questionsTimetable[q.id] || q.time || DEFAULT_QUESTION_TIME;
        return sum + Number.parseInt(qt);
      }, 0);

      setValue('time', time)
    } else {
      setValue('time', DEFAULT_STAGE_TIME)
    }
  }, [questions, questionsTimetable, setValue])

  useEffect(() => {
    const ids = questions.map(q => q.id)

    let count = 0;
    let copy = { ...questionsTimetable }

    for (let key in copy) {
      if (ids.indexOf(key) > -1) continue;

      delete copy[key]

      count++
    }

    if (count) {
      setValue('questionsTimetable', copy)
    }
  }, [setValue, questions, questionsTimetable])

  return <div className={classNames(styles['form'], className)}>
    <TimedTitle className={styles['form-title']} time={formValues.time}>{t('stages.other-questions.name-long')}</TimedTitle>
    <QuestionExplorer className={styles['form-question-explorer']} label=' ' questions={questions} onQuestions={questionsHandler} type='other' />
    <SelectedQuestionsManager onQuestionTime={handleQuestionTime} onQuestions={questionsHandler} onQuestionNote={handleQuestionNote} className={styles['form-question-manager']} feature={feature} notes={formValues.notes} questions={questions} timetable={questionsTimetable} type='other' />
  </div>
}

export default OtherQuestionStageForm;
