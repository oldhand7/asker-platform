import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'libs/react-hook-form';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import AnswersForm from 'forms/answers/answers-form';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';

import styles from './choice-question-form.module.scss'
import { useWatch } from 'react-hook-form';

const defaultValues = {
  name: { en: '' },
  desc: { en: '' },
  answers: [],
  multichoice: false
}

const ChoiceQuestionForm = ({ values, className, onValues, onCancel, loading, multichoice = false }) => {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const initValues = useMemo(() => values || defaultValues, [])

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    answers: 'min:2'
  }), [locale])

  const validationMessages = useMemo(() => ({
    'required': t('errors.field.required'),
    'min.answers': t('errors.field.min-answers').replace('[n]', 2)
  }), [locale])

  const {
    errors,
    handleSubmit,
    setValue,
    formState: { isSubmitted },
    control
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  useEffect(() => {
    setValue('multichoice', multichoice)
  }, [multichoice])

  const handleAnswers = useCallback((answers) => {
    setValue('answers', answers)
  }, [setValue])

  const handleName = useCallback((ev) => {
    setValue(`name.${locale}`, ev.target.value)
  }, [locale, setValue])

  const handleDesc = useCallback((desc) => {
    setValue(`desc.${locale}`, desc)
  }, [locale, setValue])

  return <form data-test-id="choice-question-form" onSubmit={handleSubmit(onValues)} className={classNames(styles['choice-question-form'], className)}>
    <TextInputField error={isSubmitted && errors && errors.name && errors.name[locale]} className={styles['choice-question-form-field']} onChange={handleName} value={formValues.name && formValues.name[locale]} label={t("labels.title")} name={`name.${locale}`} placeholder={t(!multichoice ? t('placeholders.drivers-license') : t('placeholders.systems'))} />
    <HtmlInputField id="desc" error={isSubmitted && errors && errors.desc && errors.desc[locale]} className={styles['choice-question-form-field']} onChange={handleDesc} diff={locale} value={formValues.desc && formValues.desc[locale]} label={t("labels.description")} name='desc' placeholder={t("labels.description")} />

    <div>
      <AnswersForm values={formValues.answers} onValues={handleAnswers} className={styles['choice-question-form-field']} title={t('labels.answers')} />
      {isSubmitted && errors && errors.answers ? <p className="form-error">{errors.answers}</p> : null}
    </div>

    <CheckboxInputField className={styles['choice-question-form-field']} checked={formValues.multichoice} label={t('headings.allow-multiple')} name="multichoice" onChange={() => setValue('multichoice', !formValues.multichoice)}  />

    <div className={styles['choice-question-form-buttons']}>
    {
      !formValues.id ?
      <>
        <TextButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="button" onClick={onCancel}>{t('actions.cancel')}</TextButton>
        <BrandishButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="submit">{t('actions.create.question')}</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="submit">{t('actions.save.question')}</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default ChoiceQuestionForm;
