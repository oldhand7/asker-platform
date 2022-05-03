import useForm from 'libs/use-form';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
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

  const handleSubmit = () => {
    onValues(values)
  }

  return <form data-test-id="candidate-form" method="POST" noValidate className={classNames(styles['candidate-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <TextInputField value={values.name} placeholder={'Candidate name'} error={errors ? errors.name : null} onChange={control.input('name')} autoComplete='off' name="name" className={styles['candidate-form-field']} />
    <TextInputField value={values.email} placeholder={'Email address'} error={errors ? errors.email : null} onChange={control.input('email')} autoComplete='off' name='email' className={styles['candidate-form-field']} />
    <PlatformButton type="submit" className={styles['candidate-form-submit']}><PlusIcon /> Add candidate</PlatformButton>
  </form>
}

export default CandidateForm;
