import useForm from 'libs/use-form';
import { useEffect, useState } from 'react';
import Alert from 'components/Alert/Alert';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PasswordInputField from 'components/PasswordInputField/PasswordInputField';
import Button from 'components/Button/Button';
import { ctxError } from 'libs/helper';
import { useRouter } from 'next/router';
import { sendPasswordResetLink } from 'libs/api';

import styles from './forgotten-form.module.scss';

const defaultValues = {
    email: '',
}

const rules = {
    email: 'email|required'
}

const ForgottenForm  = ({ className, authFunction, onSuccess }) => {
    const [values, errors, control] = useForm({ values: defaultValues, rules })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const router = useRouter();

    const handleFormValues = values => {
        setLoading(true);

        sendPasswordResetLink(values.email)
            .then(() => {
              setSuccess("Password reset link sent.")
            })
            .catch(error => {
                setLoading(false);
                setError(ctxError('Email or password invalid.', error));
            })
    }

    const getClassNames = () => {
      return classNames(
        styles['forgotten-form'],
        className
      );
    }

    useEffect(() => {
      if (success) {
        setLoading(false);

        setTimeout(() => {
          router.push('/login/')
        }, 5000)
      }
    }, [success])

    return <form data-test-id="forgotten-form" className={getClassNames()} onSubmit={control.submit(handleFormValues)}>
        {
          success ? <Alert type="success">{success}</Alert> :
          <>
            {error ? <Alert type="danger">{error.message}</Alert> : null}
            <TextInputField value={values.email} className={styles['forgotten-form-input-field']} label="Email" name="email" error={errors && errors.email} placeholder="Email"  onChange={control.input('email')}  />
            <Button className={styles['forgotten-form-submit']} type="submit" disabled={loading}>{!loading ? 'Send password reset link' : 'Loading...'}</Button>
          </>
        }
    </form>
}

export default ForgottenForm;
