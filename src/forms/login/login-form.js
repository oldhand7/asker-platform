import {useForm} from 'libs/react-hook-form';
import { useState, useMemo, useCallback } from 'react';
import Alert from 'components/Alert/Alert';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PasswordInputField from 'components/PasswordInputField/PasswordInputField';
import Button from 'components/Button/Button';
import { textToMailtoHtml } from 'libs/helper';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';
import { useWatch } from 'react-hook-form';

import styles from './login-form.module.scss';

const defaultValues = {
    username: '',
    password: ''
}

const validationRules = {
    username: 'required',
    password: 'required'
}

const LoginForm  = ({ className, authFunction, onSuccess }) => {
    const { t } = useTranslation();
    const { locale } = useRouter();

    const validationMessages = useMemo(() => ({
      'required': t('errors.field.required')
    }), [locale])

    const {
      errors,
      setValue,
      handleSubmit,
      control,
      formState: { isSubmitted }
    } = useForm({
      values: defaultValues,
      rules: validationRules,
      messages: validationMessages
    })

    const formValues = useWatch({ control, defaultValue: defaultValues })

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);

    const onSubmit = values => {
        const { username, password } = values;

        setLoading(true);

        authFunction(username, password)
          .then(onSuccess)
          .catch(error => {
              setLoading(false);
              setError(error);
          })
    }

    const getClassNames = () => {
      return classNames(
        styles['login-form'],
        className
      );
    }

    const handleUsername = useCallback(ev => {
      setValue('username', ev.target.value)
    }, [setValue])

    const handlePassword = useCallback(ev => {
      setValue('password', ev.target.value)
    }, [setValue])

    return <form method="post" data-test-id="login-form" className={getClassNames()} onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert type="danger" html={true}>{textToMailtoHtml(t(error.message))}</Alert>}

        <TextInputField value={formValues.username} className={styles['login-form-input-field']} label={t("labels.email")} name="email" error={isSubmitted && errors && errors.username} placeholder={t("labels.email")}  onChange={handleUsername}  />
        <PasswordInputField value={formValues.password} className={styles['login-form-input-field']} label={t("labels.password")} name="password" error={isSubmitted && errors && errors.password} placeholder={t("labels.password")}  onChange={handlePassword}  />

        <p style={{textAlign: 'right'}}>
          <Link href="/forgotten/"><a className={styles['login-form-link']}>{t('headings.forgotten')}?</a></Link>
        </p>

        <Button className={styles['login-form-submit']} type="submit" disabled={loading}>{!loading ? t('actions.login') : t('status.loading')}</Button>
    </form>
}

export default LoginForm;
