import {useForm} from 'libs/react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from 'components/Alert/Alert';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import Button from 'components/Button/Button';
import { ctxError } from 'libs/helper';
import { useRouter } from 'next/router';
import { sendPasswordResetLink } from 'libs/api';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';

import styles from './forgotten-form.module.scss';

const defaultValues = {
    email: '',
}

const validationRules = {
    email: 'email|required'
}

const ForgottenForm  = ({ className }) => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const router = useRouter();
    const { t } = useTranslation();

    const validationMessages = useMemo(() => ({
      required: t('errors.field.required'),
      email: t('errors.field.email')
    }), [router.locale])

    const {
      errors,
      handleSubmit,
      setValue,
      formState: { isSubmitted },
      control
    } = useForm({
      values: defaultValues,
      rules: validationRules,
      messages: validationMessages
    })

    const formValues = useWatch({ control, defaultValue: defaultValues })

    const onSubmit = values => {
        const { email } = values;

        setLoading(true);

        sendPasswordResetLink(email)
            .then(() => {
              setSuccess(t("status.password-sent"))
            })
            .catch(error => {
                setLoading(false);
                setError(ctxError(t('errors.credentials.invalid'), error));
            })
    }

    useEffect(() => {
      if (success) {
        setLoading(false);

        setTimeout(() => {
          router.push('/login/')
        }, 5000)
      }
    }, [success])

    useEffect(() => {
      setError(null);
    }, [success])

    const handleEmail = useCallback(ev => {
      setValue('email', ev.target.value)
    }, [setValue])

    return <form data-test-id="forgotten-form" className={classNames(
      styles['forgotten-form'],
      className
    )} onSubmit={handleSubmit(onSubmit)}>
        {
          success ? <Alert type="success">{success}</Alert> :
          <>
            {error ? <Alert type="danger">{error.message}</Alert> : null}

            <TextInputField value={formValues.email} className={styles['forgotten-form-input-field']} label={t("labels.email")} name="email" error={isSubmitted && errors && errors.email} placeholder={t("labels.email")}  onChange={handleEmail}  />
            <Button className={styles['forgotten-form-submit']} type="submit" disabled={loading}>{!loading ? t('actions.send-password-link') : t('status.loading')}</Button>
          </>
        }
    </form>
}

export default ForgottenForm;
