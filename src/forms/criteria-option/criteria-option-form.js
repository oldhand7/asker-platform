import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import PlusIcon from 'components/Icon/PlusIcon'
import { saveCollectionDocument } from 'libs/firestore';
import Preloader from 'components/Preloader/Preloader';
import Alert from 'components/Alert/Alert';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ctxError } from 'libs/helper';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField'
import { useForm } from 'libs/react-hook-form'
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';
import { useWatch } from 'react-hook-form';
import { useUser } from 'libs/user';

import styles from './criteria-option-form.module.scss';

const CRITERIA_LABELS = {
  'competency': 'Competency option',
  'experience': 'Experience option',
  'hard-skill': 'Hard skill option'
}

const defaultValues = {
  name: {
    en: ''
  },
  desc: {
    en: ''
  }
}

const CriteriaOptionForm = ({ className, onValues, values, type }) => {
  const { locale } = useRouter();
  const { t } = useTranslation()
  const { user } = useUser();

  const initValues = useMemo(() => ({
    ...(values || defaultValues),
    type
  }), [])

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    type: 'required'
  }), [locale])

  const validationMessages = useMemo(() => ({
    required: t('errors.field.required')
  }), [locale])

  const {
    errors,
    setValue,
    handleSubmit,
    formState: { isSubmitted },
    control
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  })
  
  const formValues = useWatch({ control, defaultValue: initValues })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    data.companyId = user.companyId;

    try {
      const id = await saveCollectionDocument('criteriaOptions', data)

      onValues({
        ...data,
        id
      })
    } catch (error) {
      setError(ctxError(t('errors.server'), error));
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  const handleName = useCallback(ev => {
    setValue(`name.${locale}`, ev.target.value)
  }, [setValue, locale])

  const handleDesc = useCallback(val => {
    setValue(`desc.${locale}`, val)
  }, [setValue, locale])

  return <form data-test-id="criteria-option-form" method="POST" noValidate className={classNames(styles['criteria-option-form'], className)} onSubmit={handleSubmit(onSubmit)}>
    <h2 className={styles['criteria-option-form-title']}>{t(CRITERIA_LABELS[type])}</h2>

    {error && <Alert type="error">{error.message}</Alert>}

    <TextInputField value={formValues.name[locale]} placeholder={t('labels.name')} error={isSubmitted && errors && errors.name && errors.name[locale]} onChange={handleName} autoComplete='off' name={`name.${locale}`} className={styles['criteria-option-form-field']} />
    {
      type == 'competency' ?
      <HtmlInputField value={formValues.desc[locale]} placeholder={`${t('labels.description')} (${t('optional')})`} error={isSubmitted && errors && errors.desc && errors.desc[locale]} onChange={handleDesc} name={`desc.${locale}`} className={styles['criteria-option-form-field']} /> :
      null
    }
    <PlatformButton disabled={loading} type="submit" className={styles['criteria-option-form-submit']}>
      {!loading ?
      (!formValues.id ? <><PlusIcon />  {t('labels.add.option')}</> : t('labels.save.option')) : t('status.loading')}
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default CriteriaOptionForm;
