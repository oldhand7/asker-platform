import useForm from 'libs/use-form';
import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useState, useEffect } from 'react';
import TextInputField from 'components/InputField/TextInputField';
import Button from 'components/Button/Button';
import GenderNeutralUserSvg from './assets/icons/icons8_gender-neutral-user.svg'
import EmailSvg from './assets/icons/fluent_mail-read-20-regular.svg'
import { useSite } from 'libs/site';
import Avatar from 'components/Avatar/Avatar';
import { uploadCompanyFile, uploadUserFile } from 'libs/firestorage';
import { changePassword as firebseChangePassword, changeEmail as frebaseChangeEmail  } from 'libs/firebase';
import { setUserProfile, useUser } from 'libs/user';
import { useModal } from 'libs/modal'
import PasswordModal from 'modals/password/password-modal'
import Uploader from 'components/Uploader/Uploader'
import TelephoneSvg from './assets/icons/telephone.svg'

import styles from './admin-profile-form.module.scss';

const defaultValues = {
  displayName: '',
  email: '',
  phoneNumber: '',
  photoURL: ''
}

const validationRules = {
  displayName: 'required',
  email: 'required|email',
  phoneNumber: 'phone_e164',
  photoURL: 'url'
}

const messages = {

}

const AdminProfileForm = ({ className }) => {
  const [rules, setRules] = useState(validationRules);
  const [values, errors, control] = useForm({ values: defaultValues, rules, messages })
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [config, t] = useSite()
  const [user, userControl] = useUser()
  const [changePassword, setChangePassword] = useState(false);

  const openPasswordModal  = useModal(PasswordModal)

  useEffect(() => {
    if (changePassword) {
      setRules({
        ...rules,
        password: 'required|min:6|confirmed',
        password_confirmation: 'required|min:6'
      })
    } else {

    }
  }, [changePassword])

  useEffect(() => {
    if (user) {
      control.setValues({
        ...user.profile
      })
    }
  }, [user])

  const handleSubmit = async () => {
    setLoading(true);

    window.scrollTo(0, 0)

    try {
      if ((values.email != user.profile.email) || changePassword) {

        const password = await new Promise((resolve, reject) => {
          openPasswordModal(resolve)
        })

        if (!password) {
          setError(new Error("You did not provide us your password!"))

          return;
        }

        await frebaseChangeEmail(password, values.email)


        if (changePassword) {
          await firebseChangePassword(password, values.password)

          setChangePassword(false);
        }
      }

      delete values.password;
      delete values.password_confirmation;

      await userControl.updateProfile(values)

      setSuccess(t('Your profile was updated!'));
    } catch (error) {
      setError(new Error(`Updating user profile faied: ${error.message}`))
    }

    setLoading(false);
  }

  const uploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);

      try {
        let photoURL;

        if (user.companyId) {
          photoURL = await uploadCompanyFile(user.companyId, file, 'images')
        } else {
          photoURL = await uploadUserFile(file, 'images')
        }

        control.set('photoURL', photoURL);
      } catch (error) {
        //@TODO
        setError(new Error(`Uploading photo failed: ${error.message}`))
      }

      setLoading(false);

      return Promise.reject();
    },
    onError: (error) => {
      setError(error)
    },
    accept: "image/jpeg"
  }

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error])

  useEffect(() => {
    if (success) {
      setError(false);
    }
  }, [success])

  return <form data-test-id="admin-profile-form" method="POST" noValidate className={classNames(styles['admin-profile-form'], className)} onSubmit={control.submit(handleSubmit)}>
    {error ? <Alert className={styles['admin-profile-form-alert']} type="error">{error.message}</Alert> : null}
    {success ? <Alert close={false} className={styles['admin-profile-form-alert']}  type="success">{success}</Alert> : null}
    <div className={styles['admin-profile-form-uploader-area']}>
      <Uploader className={styles['admin-profile-form-uploader']} {...uploadProps}>
        <Avatar className={styles['admin-profile-form-avatar']} src={values.photoURL} />
      </Uploader>
    </div>

    <TextInputField placeholder={t('Name')} value={values.displayName}  label={t('Name')} icon={<GenderNeutralUserSvg />} error={errors ? t(errors.displayName) : null} onChange={control.input('displayName')} autocomplete='off' name='displayName' type='text' className={styles['admin-profile-form-field']} />

    {/* @TODO: confirmation */}
    <TextInputField placeholder={t('Mail')} value={values.email} label={t('Mail')} icon={'email'} icon={<EmailSvg />} error={errors ? t(errors.email) : null} onChange={control.input('email')} name='email' type='email' className={styles['admin-profile-form-field']} />
    <TextInputField placeholder={t('Phone')} value={values.phoneNumber}  label={t('Phone')} icon={<TelephoneSvg />} error={errors ? t(errors.phoneNumber) : null} onChange={control.input('phoneNumber')} name='phoneNumber' type='text' className={styles['admin-profile-form-field']} />

    <div style={{ marginBottom: '10rem' }}>
    {
      changePassword ?
      <>
        <TextInputField type="password" placeholder={t('New password')} value={values.password}  label={t('New password')} error={errors ? t(errors.password) : null} onChange={control.input('password')} name='password' className={styles['admin-profile-form-field']} />
        <TextInputField type="password" placeholder={t('New password (confirm)')} value={values.password_confirmation}  label={t('New password (confirm)')} error={errors ? t(errors.password_confirmation) : null} onChange={control.input('password_confirmation')} name='password_confirmation' className={styles['admin-profile-form-field']} />
      </> :  <button type="button" onClick={() => setChangePassword(true)} style={{ textDecoration: 'underline', border: 0, background: 0, cursor: 'pointer', color: 'blue'}}>{t('Change password')}</button>
    }
    </div>


    <br />

    <button className={styles['admin-profile-form-submit']} type="submit" disabled={loading}>{!loading ? t('Save') : t('Loading...')}</button>
  </form>
}

export default AdminProfileForm;
