import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import {useForm} from 'libs/react-hook-form';
import { useUser } from 'libs/user';
import { useSite } from 'libs/site';
import styles from './text-question-form.module.scss'
import { useMemo } from 'react';

const defaultValues = {
  name: { en: ''},
  desc: { en: ''}
}

const TextQuestionForm = ({ values, className, onValues, onCancel, loading }) => {
  const { locale } = useUser();
  const { t }= useSite();

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    [`desc.${locale}`]: 'max:9000'
  }), [locale])

  const { values: formValues, errors, input, handleSubmit} = useForm({
    values: values && values.id ? values : defaultValues,
    rules: validationRules
  })

  return <form data-test-id="text-question-form" onSubmit={handleSubmit(onValues)} className={classNames(styles['text-question-form'], className)}>
    <TextInputField autoComplete="off" error={errors && errors.name && errors.name[locale]} className={styles['text-question-form-field']} onChange={input(`name.${locale}`)} value={formValues.name[locale]} label={t("Title")} name={`name.${locale}`} placeholder={t("E.g. What is your salary requirement?")} />
    <HtmlInputField id="desc" diff={locale} error={errors && errors.desc && errors.desc[locale]} className={styles['text-question-form-field']} onChange={input(`desc.${locale}`, false)} value={formValues.desc[locale]} label={t("Description")} name={`desc.${locale}`} placeholder={t("Description")} />

    <div className={styles['text-question-form-buttons']}>
    {
      !formValues.id ?
      <>
        <TextButton disabled={loading} className={styles['text-question-form-buttons-button']} type="button" onClick={onCancel}>{t('Cancel')}</TextButton>
        <BrandishButton disabled={loading} className={styles['text-question-form-buttons-button']} type="submit">{t('Create question')}</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['text-question-form-buttons-button']} type="submit">{t('Save question')}</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default TextQuestionForm;
