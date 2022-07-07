import useForm from 'libs/use-form';
import { useEffect, useState } from 'react';
import Alert from 'components/Alert/Alert';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PasswordInputField from 'components/PasswordInputField/PasswordInputField';
import Button from 'components/Button/Button';
import { ctxError } from 'libs/helper';
import Link from 'next/link';

import styles from './login-form.module.scss';

const defaultValues = {
    username: '',
    password: ''
}

const rules = {
    username: 'required',
    password: 'required'
}

const LoginForm  = ({ className, authFunction, onSuccess }) => {
    const [values, errors, control] = useForm({ values: defaultValues, rules })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);

    const handleFormValues = values => {
        setLoading(true);

        authFunction(values.username, values.password)
            .then(onSuccess)
            .catch(error => {
                setLoading(false);
                setError(error);
            })
    }

    useEffect(() => {
        if (errors) {
            setError(new Error('Form data invalid.'))
        } else {
            setError(null)
        }
    }, [errors])

    const getClassNames = () => {
      return classNames(
        styles['login-form'],
        className
      );
    }

    return <form data-test-id="login-form" className={getClassNames()} onSubmit={control.submit(handleFormValues)}>
        {error ? <Alert type="danger">{error.message}</Alert> : null}

        <TextInputField value={values.username} className={styles['login-form-input-field']} label="Email" name="email" error={errors && errors.username} placeholder="Email"  onChange={control.input('username')}  />
        <PasswordInputField value={values.password} className={styles['login-form-input-field']} label="Password" name="password" error={errors && errors.password} placeholder="Password"  onChange={control.input('password')}  />

        <p style={{textAlign: 'right'}}>
          <Link href="/forgotten/"><a className={styles['login-form-link']}>Forgotten?</a></Link>
        </p>

        <Button className={styles['login-form-submit']} type="submit" disabled={loading}>{!loading ? 'Login' : 'Loading...'}</Button>
    </form>
}

export default LoginForm;
