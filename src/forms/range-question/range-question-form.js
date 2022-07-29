import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import {useForm} from 'libs/react-hook-form';
import FlexRow from 'components/FlexRow/FlexRow'
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import styles from './range-question-form.module.scss'
import { useUser } from 'libs/user';
import { useSite } from 'libs/site';
import { useMemo } from 'react';

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
  const { locale } = useUser();
  const { t } = useSite();

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    [`desc.${locale}`]: 'max:9000',
    min: 'required|numeric',
    max: 'required|numeric',
    unit: 'required',
    step: 'required|numeric'
  }), [locale])

  const { values: formValues, errors, input, handleSubmit } = useForm({
    values: values || defaultVaues,
    rules: validationRules
  })

  return <form data-test-id="range-question-form" onSubmit={handleSubmit(onValues)} className={classNames(styles['range-question-form'], className)}>
    <TextInputField error={errors && errors.name && errors.name[locale]} className={styles['range-question-form-field']} onChange={input(`name.${locale}`)} value={formValues.name[locale]} label={t("Title")} name={`name.${locale}`} placeholder={t("E.g. What is your salary requirement?")} />
    <HtmlInputField id="desc" diff={locale} error={errors && errors.desc && errors.desc[locale]} className={styles['range-question-form-field']} onChange={input(`desc.${locale}`, false)} value={formValues.desc[locale]} label={t("Description")} name={`desc.${locale}`} placeholder={t("Description")} />

    <FlexRow>
      <TextInputField error={errors && errors.min} className={styles['range-question-form-field']} onChange={input('min')} value={formValues.min} label={t("Start value")} name='min' placeholder={t("e.g 0")}  />
      <TextInputField error={errors && errors.max} className={styles['range-question-form-field']} onChange={input('max')} value={formValues.max} label={t("End value")} name='max' placeholder={t("e.g 10")} />
    </FlexRow>

    <FlexRow>
      <TextInputField error={errors && errors.unit} className={styles['range-question-form-field']} onChange={input('unit')} value={formValues.unit} label={t("Unit value")} name='unit' placeholder={t("years")} />
      <TextInputField error={errors && errors.step} className={styles['range-question-form-field']} onChange={input('step')} value={formValues.step} label={t("Step")} name='step' placeholder="1" />
    </FlexRow>

    <div className={styles['range-question-form-buttons']}>
    {
      !formValues.id ?
      <>
        <TextButton disabled={loading} className={styles['range-question-form-buttons-button']} type="button" onClick={onCancel}>{t('Cancel')}</TextButton>
        <BrandishButton disabled={loading} className={styles['range-question-form-buttons-button']} type="submit">{t('Create question')}</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['range-question-form-buttons-button']} type="submit">{t('Save question')}</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default RangeQuestionForm;
