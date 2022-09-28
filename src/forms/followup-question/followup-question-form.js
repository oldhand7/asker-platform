import classNames from 'classnames';
import TrashButton from 'components/TrashButton/TrashButton';
import { useForm } from 'libs/react-hook-form';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'libs/translation';
import { v4 as uuidv4 } from 'uuid';
import TextInputField from 'components/TextInputField/TextInputField';
import OutlineButton from 'components/Button/OutlineButton';
import { useRouter } from 'next/router';
import PlusIcon from 'components/Icon/PlusIcon';

import styles from './followup-question-form.module.scss';

const defaultQuestion = {
  en: ''
}

const FollowupQuestionForm = ({  className, values, onValues }) => {
  const { t, i18nField } = useTranslation()
  const [mode, setMode] = useState('listing');
  const router = useRouter();

  const validationRules = useMemo(() => ({
    [`question.${router.locale}`]: 'required|max:9000'
  }), [router.locale])

  const validationMessages = useMemo(() => ({
    required: t('errors.field.required'),
    max: t('errors.field.max')
  }), [router.locale])

  const initValues = useMemo(() => ({
    questions: values,
    question: defaultQuestion
  }), [])

  const {
    handleSubmit,
    control,
    isSubmitted,
    setValue
  } = useForm({
    values: initValues,
    validation: validationRules,
    messages: validationMessages
  })

  const {
    fields: followupQuestions,
    append: addQuestion,
    remove: removeQuestion
  } = useFieldArray({
    control,
    name: 'questions',
    keyName: '_id'
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  useEffect(() => {
    onValues && onValues(followupQuestions)
  }, [followupQuestions, onValues])

  const ids = useMemo(() => ({
    heading: uuidv4()
  }), [])

  const onSubmit = ({ question }) => {
    addQuestion(question)
    setValue('question', defaultQuestion)
    setMode('listing')
  }

  const handleAddQuestion = () => {
    setMode('edit');
  }

  const handleQuestion = useCallback(ev => {
    setValue(`question.${router.locale}`, ev.target.value)
  }, [setValue])

  return <div data-test-id="followup-question-form" className={classNames(styles['form'], className)}>
    <h4 id={ids.heading} className={styles['form-label']}>
      {t('headings.followup-questions')}
      <small>{t('labels.optional')}</small>
    </h4>


    <ul aria-labelledby={ids.heading} className={styles['form-list']}>
      {followupQuestions.map((q, index) => <li key={`q${index}`} className={styles['form-list-item']}>
        <span className={styles['form-list-item']}>{i18nField(q)}</span>
        <TrashButton className={styles['form-list-item-remove']} onClick={() => removeQuestion(index)} />
      </li>)}
    </ul>
    {
      mode == 'listing' ?
      <OutlineButton type="button" onClick={handleAddQuestion} className={styles['form-submit']}><PlusIcon /> {t('actions.add.followup-question')}</OutlineButton> :
      <TextInputField focus={true} value={formValues.question[router.locale]} onEnter={handleSubmit(onSubmit)} className={styles['form-input-field']} name={`question.${router.locale}`} autoComplete="off" onChange={handleQuestion} error={isSubmitted && errors && errors.question && errors.question[locale]} placeholder={t("placeholders.responsability")} />
    }
  </div>
}

export default FollowupQuestionForm;
