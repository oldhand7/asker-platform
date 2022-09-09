import HtmlInputField from 'components/HtmlInputField/HtmlInputField'
import {useForm} from 'libs/react-hook-form';
import { useCallback, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import TimedTitle from 'components/TimedTitle/TimedTitle';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

const StageTemplateForm = dynamic(() => import('forms/stage-template/stage-template-form'))

import styles from './summary-stage-form.module.scss';
import dynamic from 'next/dynamic';

const defaultValues = {
  html: '',
  time: 5
}

const validationRules = {
  html: 'required|max:9000',
  time: 'numeric'
}

const SummaryStageForm = ({ className, onValues, values, onError, isSubmitted, test }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [diff, setDiff] = useState(0)

  const validationMessage = useMemo(() => ({
    max: t('errors.text.too-long'),
    required: t('errors.field.required')
  }), [locale])

  const initValues = useMemo(() => values || defaultValues, [])

  const {
    errors,
    setValue,
    control
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

  const handleTemplate = useCallback(template => {
    setValue('html', template.html)

    setDiff(diff + 1)
  }, [setValue, diff])

  const handleTime = useCallback(time => {
    setValue('time', time)
  }, [setValue])

  const handleHtml = useCallback(html => {
    setValue('html', html)
  }, [setValue])

  return <div className={classNames(className, styles['form'])}>
    <TimedTitle className={styles['form-title']} time={formValues.time} onChange={handleTime} >{t('stages.summary.name')}</TimedTitle>
    <HtmlInputField  diff={diff} focus={true} value={formValues.html} error={isSubmitted && errors && errors['html']} className={classNames(styles['form-field'], styles['form-text'])} name="html" onChange={handleHtml} placeholder={t("placeholders.summary-text")} />
    {!test && <StageTemplateForm className={styles['form-stage-template-form']} type='summary' values={formValues} onValues={handleTemplate} />}
  </div>
}

export default SummaryStageForm;
