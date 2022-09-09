import {useForm} from 'libs/react-hook-form';
import classNames from 'classnames';
import PasswordInputField from 'components/PasswordInputField/PasswordInputField';
import { MIN_PASSWORD_LENGTH } from 'libs/config';
import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';
import { useCallback, useMemo } from 'react';

import styles from './password-form.module.scss';
import { useWatch } from 'react-hook-form';

const defaultValues = {
  password: ''
}

const PasswordForm = ({ className, onValues, min = MIN_PASSWORD_LENGTH }) => {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const validationRules = useMemo(() => ({
    password: `required|min:${min}`
  }), [min])

  const validationMessages = useMemo(() => ({
    required: t('errors.field.required'),
    min: t('errors.field.min-chars').replace('[n]', min)
  }), [locale])

  const {
    errors,
    handleSubmit,
    formState: { isSubmitted },
    setValue,
    control
  } = useForm({
    values: defaultValues,
    rules: validationRules,
    messages: validationMessages,
  })

  const formValues = useWatch({ control , defaultValue: defaultValues })

  const onSubmit = useCallback(({ password }) => {
    onValues && onValues(password)
  }, [onValues])

  const handlePassword = useCallback(ev => {
    setValue('password', ev.target.value)
  }, [setValue])

  return <form method="POST" className={classNames(styles['password-form'], className)} onSubmit={handleSubmit(onSubmit)}>
    <PasswordInputField focus={true} value={formValues.password} placeholder={t('labels.password')} label={t('labels.password')} icon={null} error={isSubmitted && errors && errors.password} onChange={handlePassword} autoComplete='off' name='password' className={styles['password-form-field']} />

    <button className={styles['password-form-submit']} type="submit">{t('actions.submit')}</button>
  </form>
}

export default PasswordForm;
