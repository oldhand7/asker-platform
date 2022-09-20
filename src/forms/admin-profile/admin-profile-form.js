import {useForm} from 'libs/react-hook-form';
import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';

import styles from './admin-profile-form.module.scss';

const defaultFirestorageApi = {
  uploadCompanyFile,
  uploadUserFile
}

const defaultValues = {
  name: '',
  email: '',
  phone: '',
  avatar: ''
}

const rules = {
  name: 'required',
  email: 'required|email',
  phone: 'phone_e164',
  avatar: 'url'
}


const AdminProfileForm = ({ className, userApi, onValues, firestorageApi = defaultFirestorageApi }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { user, updateProfile, getAvatar, changePassword, changeEmail } = userApi || useUser()
  const [isChangingPassword, setChangePassword] = useState(false);
  const { t } = useTranslation();
  const { locale } = useRouter();

  const validationMessages = useMemo(() => ({
    required: t('errors.field.required'),
    email: t('errors.field.email')
  }), [locale])

  const validationRules = useMemo(() => {
    if (isChangingPassword) {
        return {
          ...rules,
          password: 'required|min:6|confirmed',
          password_confirmation: 'required|min:6'
        }
    }

    return rules;
  }, [isChangingPassword])

  const {
    values: formValues,
    input,
    errors: errors,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitted }
  } = useForm({
    values: defaultValues,
    rules: validationRules,
    messages: validationMessages
  })

  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, onValues])

  const openPasswordModal  = useModal(PasswordModal)

  useEffect(() => {
    if (user) {
      reset({
        ...defaultValues,
        ...user,
        avatar: getAvatar()
      })
    }
  }, [user])

  const onSubmit = async (values) => {
    setLoading(true);

    window.scrollTo(0, 0)

    try {
      if ((values.email != user.email) || isChangingPassword) {
        const password = await new Promise((resolve, reject) => {
          openPasswordModal(resolve)
        })

        if (!password) {
          setError(new Error(t("errors.password.not-provided")))

          return;
        }

        if (values.email != user.email) {
          await changeEmail(values.email, password)
        }

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

      setSuccess(t('success.profile.update'));
    } catch (error) {
      setError(ctxError(t('errors.profile.update'), error))
    }

    setLoading(false);
  }

  const uploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);

      try {
        let photoURL;
        
        if (user.companyId) {
          photoURL = await firestorageApi.uploadCompanyFile(user.companyId, file, 'images')
        } else {
          photoURL = await firestorageApi.uploadUserFile(file, 'images')
        }

        setValue('avatar', photoURL);
      } catch (error) {
        setError(ctxError(t('errors.upload.file'), error))
      }

      setLoading(false);

      return Promise.reject();
    },
    onError: (error) => {
      setError(ctxError(t('errors.upload.file'), error))
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

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(null)
      }, 7000)
    }
  }, [success])

  const handleName = useCallback(ev => {
    setValue('name', ev.target.value)
  }, [setValue])

  const handleEmail = useCallback(ev => {
    setValue('email', ev.target.value)
  }, [setValue])

  const handlePhone = useCallback(ev => {
    setValue('phone', ev.target.value)
  }, [setValue])

  const handlePassword = useCallback(ev => {
    setValue('password', ev.target.value)
  }, [setValue])

  const handlePasswordConfirmation = useCallback(ev => {
    setValue('password_confirmation', ev.target.value)
  }, [setValue])

  return <form data-test-id="admin-profile-form" method="POST" noValidate className={classNames(styles['admin-profile-form'], className)} onSubmit={handleSubmit(onSubmit)}>
    {error ? <Alert className={styles['admin-profile-form-alert']} type="error">{error.message}</Alert> : null}
    {success ? <Alert close={false} className={styles['admin-profile-form-alert']}  type="success">{success}</Alert> : null}

    <div className={styles['admin-profile-form-uploader-area']}>
      <Uploader className={styles['admin-profile-form-uploader']} {...uploadProps}>
        <Avatar className={styles['admin-profile-form-avatar']} src={formValues.avatar} />
      </Uploader>
    </div>

    <TextInputField placeholder={t('labels.name')} value={formValues.name}  label={t('labels.name')} icon={UserIcon} error={isSubmitted && errors && errors.name} onChange={handleName} autoComplete='off' name='name' type='text' className={styles['admin-profile-form-field']} />
    <TextInputField placeholder={t('labels.email')} value={formValues.email} label={t('labels.email')} icon={EmailIcon} error={isSubmitted && errors && errors.email} onChange={handleEmail} name='email' type='email' className={styles['admin-profile-form-field']} />
    <TextInputField placeholder={t('labels.phone')} value={formValues.phone}  label={t('labels.phone')} icon={TelephoneIcon} error={isSubmitted && errors && errors.phone} onChange={handlePhone} name='phone' type='text' className={styles['admin-profile-form-field']} />

    <div style={{ marginBottom: '10rem' }}>
    {
      isChangingPassword ?
      <>
        <PasswordInputField placeholder={t('labels.password.new')} value={formValues.password || ''}  label={t('labels.password.new')} error={isSubmitted && errors && errors.password} onChange={handlePassword} name='password' className={styles['admin-profile-form-field']} />
        <PasswordInputField placeholder={t('labels.password.new-confirm')} value={formValues.password_confirmation || ''}  label={t('labels.password.new-confirm')} error={isSubmitted && errors && errors.password_confirmation} onChange={handlePasswordConfirmation} name='password_confirmation' className={styles['admin-profile-form-field']} />
      </> :  <button type="button" onClick={() => setChangePassword(true)} style={{ textDecoration: 'underline', border: 0, background: 0, cursor: 'pointer', color: 'blue'}}>{t('actions.change.password')}</button>
    }
    </div>

    <br />

    <button className={styles['admin-profile-form-submit']} type="submit" disabled={loading}>{!loading ? t('actions.save') : t('status.loading')}</button>

    {loading ? <Preloader /> : null}
  </form>
}

export default AdminProfileForm;
