import TextInputField from 'components/TextInputField/TextInputField';
import { useForm } from 'libs/react-hook-form'
import { useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import { DEFAULT_QUESTION_TIME } from 'libs/config';
import TimedTitle from 'components/TimedTitle/TimedTitle';
import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';

import styles from './salary-stage-form.module.scss';
import { useWatch } from 'react-hook-form';

const defaultValues = {
  min: '0',
  max: '4000',
  notes: '',
  time: DEFAULT_QUESTION_TIME
}

const validationRules = {
  min: 'required|numeric',
  max: 'required|numeric',
  notes: 'max:9000',
}

const SalaryStageForm = ({ className, values, onValues, onError, markComplete, pristine = true }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const validationMessages = useMemo(() => ({
    required: t('errors.field.required'),
    numeric: t('errors.field.numeric')
  }), [locale])

  const initValues = useMemo(() => values || defaultValues, [])

  const {
    errors,
    control,
    setValue
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  })

  const formValues = useWatch({ control, defaultValue: initValues })
  
  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  const handleMin = useCallback(ev => {
    setValue('min', ev.target.value)
  }, [setValue])

  const handleMax = useCallback(ev => {
    setValue('max', ev.target.value)
  }, [setValue])

  const handleTime = useCallback(val => {
    setValue('time', val)
  }, [setValue])

  const handleNote = useCallback(val => {
    setValue('note', val)
  }, [setValue])

  return <div className={classNames(styles['salary-stage-form'], className)}>
    <TimedTitle className={styles['introduction-stage-form-title']}  time={formValues.time} onChange={handleTime}>
      {t('stages.salary.name')}
    </TimedTitle>

    <div className={styles['salary-stage-form-range']}>
      <h5 className={styles['salary-stage-form-range-label']}>{t('labels.budget-range')}</h5>
      <div className={styles['salary-stage-form-range-input-wrapper']}>
        <span className={styles['salary-stage-form-range-divider-text']}>{t('labels.from')}</span>
        <TextInputField error={!pristine && errors && errors.min} className={styles['salary-stage-form-range-input']} placeholder='0' onChange={handleMin} name="min" value={formValues.min} />
        <span className={styles['salary-stage-form-range-divider-text']}>- {t('labels.to')}</span>
        <TextInputField error={!pristine && errors && errors.max} className={styles['salary-stage-form-range-input']} placeholder='9999' onChange={handleMax} name="max" value={formValues.max} />
      </div>
    </div>

    <div className={styles['salary-stage-form-note']}>
      <h5 className={styles['salary-stage-form-note-label']}>{t('labels.notes-interviewer')}</h5>
      <HtmlInputField diff={0} value={formValues.note} className={styles['salary-stage-form-field']} name="note" onChange={handleNote} placeholder={t("placeholders.enter-text")} />
      {!pristine && errors && errors.note && <p className="form-error">{errors.note}</p>}
    </div>
  </div>
}
export default SalaryStageForm;
