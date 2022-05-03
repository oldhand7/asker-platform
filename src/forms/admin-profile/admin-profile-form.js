import useForm from 'libs/use-form';
import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useState, useEffect } from 'react';
import TextInputField from 'components/TextInputField/TextInputField';
import Avatar from 'components/Avatar/Avatar';
import { uploadCompanyFile, uploadUserFile } from 'libs/firestorage';
import { useUser } from 'libs/user';
import { useModal } from 'libs/modal'
import PasswordModal from 'modals/password/password-modal'
import Uploader from 'components/Uploader/Uploader'
import PasswordInputField from 'components/PasswordInputField/PasswordInputField';
import TelephoneIcon from 'components/Icon/TelephoneIcon';
import EmailIcon from 'components/Icon/EmailIcon';
import UserIcon from 'components/Icon/UserIcon';
import { ctxError } from 'libs/helper';
import Preloader from 'components/Preloader/Preloader';

import styles from './admin-profile-form.module.scss';

const defaultValues = {
  name: '',
  email: '',
  phone: '',
  avatar: ''
}

const validationRules = {
  name: 'required',
  email: 'required|email',
  phone: 'phone_e164',
  avatar: 'url'
}

const messages = {

}

const AdminProfileForm = ({ className }) => {
  const [rules, setRules] = useState(validationRules);
  const [values, errors, control] = useForm({ values: defaultValues, rules, messages })
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { user, updateProfile, getAvatar, changePassword, changeEmail } = useUser()
  const [isChangingPassword, setChangePassword] = useState(false);

  const openPasswordModal  = useModal(PasswordModal)

  useEffect(() => {
    if (isChangingPassword) {
      setRules({
        ...rules,
        password: 'required|min:6|confirmed',
        password_confirmation: 'required|min:6'
      })
    } else {

    }
  }, [isChangingPassword])

  useEffect(() => {
    if (user) {
      control.setValues({
        ...defaultValues,
        ...user,
        avatar: getAvatar()
      })
    }
  }, [user])

  const handleSubmit = async () => {
    setLoading(true);

    window.scrollTo(0, 0)

    try {
      if ((values.email != user.email) || isChangingPassword) {
        const password = await new Promise((resolve, reject) => {
          openPasswordModal(resolve)
        })

        if (!password) {
          setError(new Error("You did not provide us your password!"))

          return;
        }

        await changeEmail(values.email, password)

        if (isChangingPassword) {
          await changePassword(values.password, password)

          setChangePassword(false);
        }
      }

      delete values.password;
      delete values.password_confirmation;

      const { avatar, ...profile } = values;

      await updateProfile({
        ...profile,
        images: values.avatar ? [
          { src: values.avatar, title: '' }
        ] : []
      })

      setSuccess('Your profile was updated!!');
    } catch (error) {
      setError(ctxError('Updating user profile failed!', error))
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

        control.set('avatar', photoURL);
      } catch (error) {
        setError(ctxError('Uploading photo failed.', error))
      }

      setLoading(false);

      return Promise.reject();
    },
    onError: (error) => {
      setError(ctxError('Uploading photo failed.', error))
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
        <Avatar className={styles['admin-profile-form-avatar']} src={values.avatar} />
      </Uploader>
    </div>

    <TextInputField placeholder={'Name'} value={values.name}  label={'Name'} icon={UserIcon} error={errors ? errors.name : null} onChange={control.input('name')} autoComplete='off' name='name' type='text' className={styles['admin-profile-form-field']} />
    <TextInputField placeholder={'Mail'} value={values.email} label={'Mail'} icon={EmailIcon} error={errors ? errors.email : null} onChange={control.input('email')} name='email' type='email' className={styles['admin-profile-form-field']} />
    <TextInputField placeholder={'Phone'} value={values.phone}  label={'Phone'} icon={TelephoneIcon} error={errors ? errors.phone : null} onChange={control.input('phone')} name='phone' type='text' className={styles['admin-profile-form-field']} />

    <div style={{ marginBottom: '10rem' }}>
    {
      isChangingPassword ?
      <>
        <PasswordInputField placeholder={'New password'} value={values.password || ''}  label={'New password'} error={errors ? errors.password : null} onChange={control.input('password')} name='password' className={styles['admin-profile-form-field']} />
        <PasswordInputField placeholder={'New password (confirm)'} value={values.password_confirmation || ''}  label={'New password (confirm)'} error={errors ? errors.password_confirmation : null} onChange={control.input('password_confirmation')} name='password_confirmation' className={styles['admin-profile-form-field']} />
      </> :  <button type="button" onClick={() => setChangePassword(true)} style={{ textDecoration: 'underline', border: 0, background: 0, cursor: 'pointer', color: 'blue'}}>{'Change password'}</button>
    }
    </div>


    <br />

    <button className={styles['admin-profile-form-submit']} type="submit" disabled={loading}>{!loading ? 'Save' : 'Loading...'}</button>

    {loading ? <Preloader /> : null}
  </form>
}

export default AdminProfileForm;
