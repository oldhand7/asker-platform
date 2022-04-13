import useForm from 'libs/use-form';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import { useSite } from 'libs/site';
import PlusIcon from 'components/Icon/PlusIcon'

import styles from './candidate-form.module.scss';

const defaultValues = {
  name: '',
  email: ''
}

const rules = {
  name: 'required',
  email: 'required|email'
}

const messages = {

}

const CandidateForm = ({ className, onValues }) => {
  const [values, errors, control] = useForm({ values: defaultValues, rules, messages })
  const [config, t] = useSite()

  const handleSubmit = () => {
    onValues(values)
  }

  return <form method="POST" noValidate className={classNames(styles['candidate-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <TextInputField value={values.name} placeholder={t('Candidate name')} error={errors ? t(errors.name) : null} onChange={control.input('name')} autoComplete='off' name="name" className={styles['candidate-form-field']} />
    <TextInputField value={values.email} placeholder={t('Email address')} error={errors ? t(errors.email) : null} onChange={control.input('email')} autoComplete='off' name='email' className={styles['candidate-form-field']} />
    <PlatformButton className={styles['candidate-form-submit']}><PlusIcon /> Add candidate</PlatformButton>
  </form>
}

export default CandidateForm;
