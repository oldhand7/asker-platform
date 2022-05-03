import useForm from 'libs/use-form';
import classNames from 'classnames';
import PasswordInputField from 'components/PasswordInputField/PasswordInputField';
import Button from 'components/Button/Button';
import { useSite } from 'libs/site';

import styles from './password-form.module.scss';

const defaultValues = {
  password: ''
}

const rules = {
  password: 'required|min:6'
}

const messages = {

}

const PasswordForm = ({ className, onSuccess }) => {
  const [values, errors, control] = useForm({ values: defaultValues, rules, messages })

  const handleSubmit = () => {
    onSuccess(values.password)
  }

  return <form method="POST" noValidate className={classNames(styles['password-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <PasswordInputField focus={true} value={values.password} placeholder={'Password'} label={'Password'} icon={null} error={errors ? errors.password : null} onChange={control.input('password')} autoComplete='off' name='password' className={styles['password-form-field']} />

    <button className={styles['password-form-submit']} type="submit">{'Submit'}</button>
  </form>
}

export default PasswordForm;
