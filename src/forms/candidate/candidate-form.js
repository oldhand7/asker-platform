import { useForm } from 'libs/react-hook-form';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import PlusIcon from 'components/Icon/PlusIcon'
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';
import { useWatch } from 'react-hook-form';
import { getRandomAlias } from 'libs/candidate';
import classNames from 'classnames';

import styles from './candidate-form.module.scss';

const defaultValues = {
  name: '',
  email: '',
  alias: ''
}

const validationRules = {
  name: 'required',
  email: 'required|email'
}

const CandidateForm = ({ className, values, onValues, alias }) => {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const initValues = useMemo(() => ({
    ...(values || defaultValues, []),
    alias: alias || getRandomAlias()
  }), [])

  const messages = useMemo(() => ({
      'required': t('errors.field.required'),
      'email': t('errors.field.email'),
    }), [locale])

  const {
    errors,
    handleSubmit,
    formState: { isSubmitted },
    setValue,
    control
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  const handleCandidateName = useCallback((ev) => {
    setValue('name', ev.target.value)
  }, [setValue])

  const handleCandidateEmail = useCallback((ev) => {
    setValue('email', ev.target.value)
  }, [setValue])

  return <form data-test-id="candidate-form" method="POST" noValidate className={classNames(styles['candidate-form'], className)} onSubmit={handleSubmit(onValues)}>
    <TextInputField value={formValues.name} placeholder={t('labels.candidate-name')} error={isSubmitted && errors && errors.name} onChange={handleCandidateName} autoComplete='off' name="name" className={styles['candidate-form-field']} />
    <TextInputField value={formValues.email} placeholder={t('labels.email')} error={isSubmitted && errors && errors.email} onChange={handleCandidateEmail} autoComplete='off' name='email' className={styles['candidate-form-field']} />
    <PlatformButton type="submit" className={styles['candidate-form-submit']}><PlusIcon /> {t('actions.add-candidate')}</PlatformButton>
  </form>
}

export default CandidateForm;
