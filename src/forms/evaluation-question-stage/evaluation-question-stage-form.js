import classNames from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'libs/react-hook-form';
import QuestionExplorer from 'components/QuestionExplorer/QuestionExplorer';
import SelectedQuestionsManager from 'components/SelectedQuestionsManager/SelectedQuestionsManager';
import { SHORT_IDS, SHORT_NAMES } from 'libs/stage';
import {  DEFAULT_QUESTION_TIME, DEFAULT_STAGE_TIME } from 'libs/config';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import TimedTitle from 'components/TimedTitle/TimedTitle'

import styles from './evaluation-question-stage-form.module.scss';

const defaultValues = {
  questions: [],
  time: DEFAULT_STAGE_TIME,
  questionsTimetable: {},
  notes: {}
}

const validationRules = {
  questions: 'array',
}

const EvaluationQuestionStageForm = ({ className, values, onValues, feature, onError, isSubmitted }) => {
  const { t } = useTranslation();

  const initValues = useMemo(() => ({ ...defaultValues, ...(values || {})}), [])

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
  }, [formValues, onValues])

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

  const title = useMemo(() => {
    const { subtype } = feature;

    if (subtype == 'competency') {
      return t('stages.competency-questions.name')
    }

    if (subtype == 'experience') {
      return t('stages.experience-questions.name')
    }

    if (subtype == 'hard-skill') {
      return t('stages.hard-skill-questions.name')
    }

    if (subtype == 'culture') {
      return t('stages.culture-questions.name')
    }

    if (subtype == 'motivation') {
      return t('stages.motivation-questions.name')
    }

    return feature.shortName || feature.name;
  }, [feature])

  return <div className={classNames(styles['from'], className)}>
    <TimedTitle className={styles['form-title']} time={formValues.time}>{title}</TimedTitle>
    <QuestionExplorer type={'evaluation'} subtype={SHORT_IDS[feature.id]} label={' '} className={styles['form-question-explorer']} questions={questions} onQuestions={questionsHandler} />
    <SelectedQuestionsManager onQuestionTime={handleQuestionTime} onQuestions={questionsHandler} onQuestionNote={handleQuestionNote} className={styles['form-question-manager']} feature={feature} notes={formValues.notes} questions={questions} timetable={questionsTimetable} type='evaluation' />
  </div>
}

export default EvaluationQuestionStageForm;
