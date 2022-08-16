import useForm from 'libs/use-form';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import PlusIcon from 'components/Icon/PlusIcon'
import { useSite  } from 'libs/site';
import { getRandomAlias } from 'libs/candidate';
import { useMemo } from 'react';

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

const CandidateForm = ({ className, onValues, values, alias }) => {
  const initValues = useMemo(() => ({
    ...(values || defaultValues),
    alias: alias || getRandomAlias()
  }), [])

  const [formValues, errors, control] = useForm({
    values: initValues,
    rules,
    messages
  })

  return <form data-test-id="candidate-form" method="POST" noValidate className={classNames(styles['candidate-form'], className)} onSubmit={control.submit(onValues)}>
    <TextInputField value={formValues.name} placeholder={'Candidate name'} error={errors ? errors.name : null} onChange={control.input('name')} autoComplete='off' name="name" className={styles['candidate-form-field']} />
    <TextInputField value={formValues.email} placeholder={'Email address'} error={errors ? errors.email : null} onChange={control.input('email')} autoComplete='off' name='email' className={styles['candidate-form-field']} />
    {
      !values ?
      <PlatformButton type="submit" className={styles['candidate-form-submit']}><PlusIcon /> Add candidate</PlatformButton> :
      <PlatformButton type="submit" className={styles['candidate-form-submit']}>Save changes</PlatformButton>
    }
  </form>
}

export default CandidateForm;
