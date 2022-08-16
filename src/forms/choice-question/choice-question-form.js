import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'libs/react-hook-form';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import AnswersForm from 'forms/answers/answers-form';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import { useSite } from 'libs/site';
import { useUser } from 'libs/user';

import styles from './choice-question-form.module.scss'

const defaultValues = {
  name: { en: '' },
  desc: { en: '' },
  answers: [],
  multichoice: false
}

const ChoiceQuestionForm = ({ values, className, onValues, onCancel, loading, multichoice = false }) => {
  const { locale } = useUser();

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    answers: 'required|min:1'
  }), [locale])

  const { values: formValues, errors, input, handleSubmit, setValue } = useForm({
    values: values || defaultValues,
    rules: validationRules
  })
  const { t } = useSite();

  useEffect(() => {
    setValue('multichoice', multichoice)
  }, [multichoice])

  return <form data-test-id="choice-question-form" onSubmit={handleSubmit(onValues)} className={classNames(styles['choice-question-form'], className)}>
    <TextInputField error={errors && errors.name && errors.name[locale]} className={styles['choice-question-form-field']} onChange={input(`name.${locale}`)} value={formValues.name && formValues.name[locale]} label={t("Title")} name={`name.${locale}`} placeholder={t(!multichoice ? "E.g. Do you have a driving licence?" : "E.g. Which of the following systems are you used working with?")} />
    <HtmlInputField id="desc" error={errors && errors.desc && errors.desc[locale]} className={styles['choice-question-form-field']} onChange={input(`desc.${locale}`, false)} diff={locale} value={formValues.desc && formValues.desc[locale]} label={t("Description")} name='desc' placeholder={t("Description")} />

    <div>
      <AnswersForm values={formValues.answers} onValues={input('answers', false)} className={styles['choice-question-form-field']} title={t('Answers')} />
      {errors && errors.answers ? <p className="form-error">{errors.answers}</p> : null}
    </div>

    <CheckboxInputField className={styles['choice-question-form-field']} checked={formValues.multichoice} label="Allow multiple answers?" name="multichoice" onChange={() => setValue('multichoice', !formValues.multichoice)}  />

    <div className={styles['choice-question-form-buttons']}>
    {
      !formValues.id ?
      <>
        <TextButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="button" onClick={onCancel}>{t('Cancel')}</TextButton>
        <BrandishButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="submit">{t('Create question')}</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="submit">{t('Save question')}</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default ChoiceQuestionForm;
