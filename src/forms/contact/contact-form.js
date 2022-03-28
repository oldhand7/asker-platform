import useForm from 'libs/use-form';
import classNames from 'classnames';
import { sendContactMessage } from 'libs/api';
import Alert from 'components/Alert/Alert';
import { useState, useEffect } from 'react';
import InputField from 'components/InputField/InputField';
import Button from 'components/Button/Button';
import GenderNeutralUserSvg from './assets/icons/icons8_gender-neutral-user.svg'
import EmailSvg from './assets/icons/fluent_mail-read-20-regular.svg'
import { useSite } from 'libs/site';

import styles from './contact-form.module.scss';

const defaultValues = {
  contact_name: '',
  contact_email: '',
  contact_message: ''
}

const rules = {
  contact_name: 'required',
  contact_email: 'required|email',
  contact_message: 'required'
}

const messages = {

}

const ContactForm = ({ className }) => {
  const [values, errors, control] = useForm({ values: defaultValues, rules, messages })
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [config, t] = useSite()

  useEffect(() => {
    if (errors) {
      setError(new Error(t('Form fields invalid.')))
    } else {
      setError(null);
    }
  }, [errors])

  const handleSubmit = () => {
    sendContactMessage(values)
      .then(() => {
        setSuccess(t('Thank you!'));
      })
      .catch(setError)
  }

  if (success) {
    return <div className={classNames(styles['contact-form'], className)}>
      <Alert close={false} className={styles['contact-form-alert']}  type="success">{success}</Alert>
    </div>
  }

  return <form method="POST" noValidate className={classNames(styles['contact-form'], className)} onSubmit={control.submit(handleSubmit)}>
    {error ? <Alert className={styles['contact-form-alert']} type="error">{error.message}</Alert> : null}

    <InputField value={values.contact_name} placeholder={t('Your name')} label={t('Your name')} icon={<GenderNeutralUserSvg />} error={errors ? t(errors.contact_name) : null} onChange={control.input('contact_name')} autocomplete='off' name='contact_name' type='text' className={styles['contact-form-field']} />
    <InputField placeholder={t('Mail')} value={values.contact_email} label={t('Mail')} icon={'email'} icon={<EmailSvg />} error={errors ? t(errors.contact_email) : null} onChange={control.input('contact_email')} name='contact_email' type='email' className={styles['contact-form-field']} />
    <InputField placeholder={t('Message')} value={values.contact_message}  label={t('Message')} error={errors ? t(errors.contact_message) : null} onChange={control.input('contact_message')} name='contact_message' type='textarea' className={styles['contact-form-field']} />

    <button className={styles['contact-form-submit']} type="submit">{t('Send message')}</button>
  </form>
}

export default ContactForm;
