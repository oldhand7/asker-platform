
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import { useForm } from 'libs/react-hook-form';
import { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import ThemedButton from 'components/Button/ThemedButton';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

import styles from './question-note-form.module.scss';

const defaultValue = {
    text: {
        en: ''
    },
    share: false
}

const QuestionNoteForm = ({ values, onValues, className }) => {
   const { locale } = useRouter();
   const { t } = useTranslation();

   const validationRules = useMemo(() => ({
    [`text.${locale}`]: 'required',
   }), [locale])

   const validationMessages = useMemo(() => ({
    required: t('errors.field.required')
   }), [locale])

   const initValues = useMemo(() => values || defaultValue, [])

   const {
    errors,
    handleSubmit,
    input,
    formState: { isSubmitted },
    control,
    setValue
   }  = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  });
  
  const formValues = useWatch({ control, defaultValue: initValues })

  const handleText = useCallback((text) => {
    setValue(`text.${locale}`, text)
  }, [locale, setValue])
    
  return <form onSubmit={handleSubmit(onValues)} className={classNames(className, styles['form'])}>
    <h3 className={styles['form-title']}>{t('headings.add-question-note')}</h3>

    <HtmlInputField error={isSubmitted && errors && errors.text && errors.text[locale]} className={styles['form-input-field']} diff={locale} value={formValues.text[locale]} onChange={handleText} />

    <div className={styles['form-footer']}>
        <ThemedButton className={styles['form-footer-button']} type="submit" theme='green'>{t('actions.save.note')}</ThemedButton>
        <ThemedButton className={styles['form-footer-button']} type="button" theme='red' onClick={() => onValues(0)}>{t('actions.delete')}</ThemedButton>
    </div>
  </form>
}

export default QuestionNoteForm;