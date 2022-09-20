import {useForm} from 'libs/react-hook-form';
import { useCallback, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import TimedTitle from 'components/TimedTitle/TimedTitle';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import I18nHtmlInputField from 'components/I18nHtmlInputField/I18nHtmlInputField'

const StageTemplateForm = dynamic(() => import('forms/stage-template/stage-template-form'))

import styles from './introduction-stage-form.module.scss';

const defaultValues = {
  html: { en: '', se: '' },
  templateId: null,
  time: 5
}

const IntroductionStageForm = ({ className, onValues, values, onError, isSubmitted, test }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [diff, setDiff] = useState(0)

  const validationRules = useMemo(() => ({
    [`html.${locale}`]: 'required|max:9000',
    time: 'numeric'
  }), [locale])

  const validationMessage = useMemo(() => ({
    max: t('errors.text.too-long'),
    required: t('errors.field.required')
  }), [locale])

  const initValues = useMemo(() => values || defaultValues, [])

  const {
    errors,
    setValue,
    control,
    reset
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessage
  })

  const formValues = useWatch({
    control,
    defaultValue: initValues
  })
  
  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  const handleTemplate = useCallback(({ id, values }) => {
    reset({
      ...values,
      templateId: id,
    })
    setDiff(diff+1)
  }, [reset, diff])

  const handleTime = useCallback(time => {
    setValue('time', time)
  }, [setValue])

  const handleHtml = useCallback((html, locale) => {
    setValue(`html.${locale}`, html)
  }, [setValue])

  return <div className={classNames(className, styles['form'])}>
    <TimedTitle className={styles['form-title']} time={formValues.time} onChange={handleTime}>{t('stages.introduction.name')}</TimedTitle>
    <I18nHtmlInputField diff={diff} values={formValues.html} errors={isSubmitted && errors && errors.html} className={classNames(styles['form-field'], styles['form-text'])} onChange={handleHtml} name="html" placeholder={t("placeholders.introduction-text")} />
    {!test && <StageTemplateForm className={styles['form-stage-template-form']} type='introduction' values={formValues} onValues={handleTemplate} />}
  </div>
}

export default IntroductionStageForm;
