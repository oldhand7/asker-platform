import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import {useForm} from 'libs/react-hook-form';
import FlexRow from 'components/FlexRow/FlexRow'
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import styles from './range-question-form.module.scss'
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

const defaultVaues = {
  name: {
    en: ''
  },
  desc: {
    en: ''
  },
  min: '',
  max: '',
  unit: '',
  step: 1
}

const RangeQuestionForm = ({ values, className, onValues, onCancel, loading }) => {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    [`desc.${locale}`]: 'max:9000',
    min: 'required|numeric',
    max: 'required|numeric',
    unit: 'required',
    step: 'required|numeric'
  }), [locale])

  const validationMessages = useMemo(() => ({
    'required': t('errors.field.required'),
    'max': t('errors.field.max'),
    'numeric': t('erros.field.numeric')
  }), [locale])

  const initValues = useMemo(() => values || defaultVaues, []);

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

  const handleName = useCallback((ev) => {
    setValue(`name.${locale}`, ev.target.value)
  }, [locale, setValue])

  const handleDesc = useCallback((desc) => {
    setValue(`desc.${locale}`, desc)
  }, [locale, setValue])

  const handleMin = useCallback((ev) => {
    setValue('min', ev.target.value)
  }, [setValue])

  const handleMax = useCallback((ev) => {
    setValue('max', ev.target.value)
  }, [setValue])

  const handleUnit = useCallback((ev) => {
    setValue('unit', ev.target.value)
  }, [setValue])

  const handleStep = useCallback((ev) => {
    setValue('step', ev.target.value)
  }, [setValue])

  return <form data-test-id="range-question-form" onSubmit={handleSubmit(onValues)} className={classNames(styles['range-question-form'], className)}>
    <TextInputField error={isSubmitted && errors && errors.name && errors.name[locale]} className={styles['range-question-form-field']} onChange={handleName} value={formValues.name[locale]} label={t("labels.title")} name={`name.${locale}`} placeholder={t("placeholders.salary-requirement")} />
    <HtmlInputField id="desc" diff={locale} error={errors && errors.desc && errors.desc[locale]} className={styles['range-question-form-field']} onChange={handleDesc} value={formValues.desc[locale]} label={t("labels.description")} name={`desc.${locale}`} placeholder={t("labels.description")} />

    <FlexRow>
      <TextInputField error={isSubmitted && errors && errors.min} className={styles['range-question-form-field']} onChange={handleMin} value={formValues.min} label={t("labels.start-value")} name='min' placeholder={t("placeholders.eg0")}  />
      <TextInputField error={isSubmitted && errors && errors.max} className={styles['range-question-form-field']} onChange={handleMax} value={formValues.max} label={t("labels.end-value")} name='max' placeholder={t("placeholders.eg10")} />
    </FlexRow>

    <FlexRow>
      <TextInputField error={isSubmitted && errors && errors.unit} className={styles['range-question-form-field']} onChange={handleUnit} value={formValues.unit} label={t("labels.unit-value")} name='unit' placeholder={t("placeholders.years")} />
      <TextInputField error={isSubmitted && errors && errors.step} className={styles['range-question-form-field']} onChange={handleStep} value={formValues.step} label={t("labels.step")} name='step' placeholder="1" />
    </FlexRow>

    <div className={styles['range-question-form-buttons']}>
    {
      !formValues.id ?
      <>
        <TextButton disabled={loading} className={styles['range-question-form-buttons-button']} type="button" onClick={onCancel}>{t('labels.cancel')}</TextButton>
        <BrandishButton disabled={loading} className={styles['range-question-form-buttons-button']} type="submit">{t('actions.create.question')}</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['range-question-form-buttons-button']} type="submit">{t('actions.save.question')}</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default RangeQuestionForm;
