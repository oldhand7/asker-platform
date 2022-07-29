
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import { useForm } from 'libs/react-hook-form';
import { useUser } from 'libs/user';
import { useMemo } from 'react';
import classNames from 'classnames';
import ThemedButton from 'components/Button/ThemedButton';

import styles from './question-note-form.module.scss';
import { useSite } from 'libs/site';

const defaultValue = {
    text: {
        en: ''
    },
    share: false
}

const QuestionNoteForm = ({ values, onValues, className }) => {
   const { locale } = useUser();
   const { t } = useSite();

   const validationRules = useMemo(() => ({
    [`text.${locale}`]: 'required',
   }), [locale])

   const validationMessages = useMemo(() => ({
    [`required.text.${locale}`]: t('Add some text'),
   }), [locale])

   const {
    values: formValues,
    errors,
    handleSubmit,
    input,
    setValue
   }  = useForm({
    values: values || defaultValue,
    rules: validationRules,
    messages: validationMessages});
    
  return <form onSubmit={handleSubmit(onValues)} className={classNames(className, styles['form'])}>
    <h3 className={styles['form-title']}>{t('Add note to question')}</h3>


    <HtmlInputField error={errors && errors.text && errors.text[locale]} className={styles['form-input-field']} diff={locale} value={formValues.text[locale]} onChange={input(`text.${locale}`, false)} />

    <div className={styles['form-footer']}>
        {/*<CheckboxInputField className={styles['form-footer-share-input']} label={t('Share not for all projects')} checked={formValues.share} onChange={() => setValue('share', !formValues.share)} />*/}
        <ThemedButton className={styles['form-footer-button']} type="submit" theme='green'>{t('Save note')}</ThemedButton>
        <ThemedButton className={styles['form-footer-button']} type="button" theme='red' onClick={() => onValues(0)}>{t('Delete')}</ThemedButton>
    </div>
  </form>
}

export default QuestionNoteForm;