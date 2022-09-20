import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import {useForm} from 'libs/react-hook-form';
import styles from './text-question-form.module.scss'
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';
import { useWatch } from 'react-hook-form';

const defaultValues = {
  name: { en: ''},
  desc: { en: ''}
}

const TextQuestionForm = ({ values, className, onValues, onCancel, loading }) => {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const initValues = useMemo(() => values || defaultValues, [])

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    [`desc.${locale}`]: 'max:9000'
  }), [locale])

  const validationMessages = useMemo(() => ({
    required: t('errors.field.required'),
    max: t('errors.field.max')
  }), [locale])

  const {
    setValue,
    errors,
    handleSubmit,
    formState: { isSubmitted },
    control
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  const handleName = useCallback((ev) => {
    setValue(`name.${locale}`, ev.target.value)
  }, [locale, setValue])

  const handleDesc = useCallback((desc) => {
    setValue(`desc.${locale}`, desc)
  }, [locale, setValue])

  return <form data-test-id="text-question-form" onSubmit={handleSubmit(onValues)} className={classNames(styles['text-question-form'], className)}>
    <TextInputField autoComplete="off" error={isSubmitted && errors && errors.name && errors.name[locale]} className={styles['text-question-form-field']} onChange={handleName} value={formValues.name[locale]} label={t("labels.title")} name={`name.${locale}`} placeholder={t("placeholders.salary-requirement")} />
    <HtmlInputField id="desc" diff={locale} error={isSubmitted && errors && errors.desc && errors.desc[locale]} className={styles['text-question-form-field']} onChange={handleDesc} value={formValues.desc[locale]} label={t("labels.description")} name={`desc.${locale}`} placeholder={t("labels.description")} />

    <div className={styles['text-question-form-buttons']}>
    {
      !formValues.id ?
      <>
        <TextButton disabled={loading} className={styles['text-question-form-buttons-button']} type="button" onClick={onCancel}>{t('actions.cancel')}</TextButton>
        <BrandishButton disabled={loading} className={styles['text-question-form-buttons-button']} type="submit">{t('actions.create.question')}</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['text-question-form-buttons-button']} type="submit">{t('actions.save.question')}</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default TextQuestionForm;
