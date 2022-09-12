import {useForm} from 'libs/react-hook-form';
import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useState, useEffect, useMemo, useCallback } from 'react';
import TextInputField from 'components/TextInputField/TextInputField';
import { useUser } from 'libs/user';
import { useCompany } from 'libs/company'
import Preloader from 'components/Preloader/Preloader'
import Uploader from 'components/Uploader/Uploader';
import { uploadCompanyFile } from 'libs/firestorage';
import { ctxError } from 'libs/helper';
import CompanyLogoPlaceholder from './assets/images/placeholder.png'
import { useTranslation } from 'libs/translation';
import { useRouter } from 'next/router';
import { useWatch } from 'react-hook-form';

import styles from './company-profile-form.module.scss';

const rules = {
  name: 'required'
}

const CompanyProfileForm = ({ className }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { user } = useUser()
  const [company, updateCompany] = useCompany(user && user.companyId)
  const { t } = useTranslation();
  const { locale } = useRouter();

  const messages = useMemo(() => ({
    required: t('errors.field.required')
  }), [locale])

  const {
    errors,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitted },
    control
  } = useForm({
    values: company,
    rules,
    messages
  })

  const formValues = useWatch({ control, defaultValue: company })

  useEffect(() => {
    company && reset(company)
  }, [company, reset])

  useEffect(() => {
    isSubmitted && setError(errors && new Error(t('errors.form.invalid')))
  }, [errors, isSubmitted, locale])

  const onSubmit = (values) => {
    setLoading(true);

    updateCompany(values)
      .then(() => {
        setSuccess(t('status.company-updated'));
        setLoading(false);
      })
      .catch(error => {
        setError(ctxError(t('errors.server'), error))
        setLoading(false);
      })
  }

  useEffect(() => {
    if (success) {
      setError(null)
    }
  }, [success])

  const uploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);

      try {
        let imageURL;

        if (user.companyId) {
          imageURL = await uploadCompanyFile(company.id, file, 'images')
        }

        updateCompany({
          ...company,
          images: [
            { src: imageURL, title: t('labels.logo')}
          ]
        });
      } catch (error) {
        setError(ctxError(t('errors.upload'), error))
      }

      setLoading(false);

      return Promise.reject();
    },
    onError: (error) => {
      setError(ctxError(t('errors.upload'), error))
    },
    accept: "image/jpeg, image/png"
  }

  const handleName = useCallback(ev => {
    setValue('name', ev.target.value)
  }, [setValue])

  return formValues ? <form method="POST" noValidate className={classNames(styles['company-profile-form'], className)} onSubmit={handleSubmit(onSubmit)}>
    {error && <Alert className={styles['company-profile-form-alert']} type="error">{error.message}</Alert>}
    {success && <Alert className={styles['company-profile-form-alert']} type="success">{success}</Alert>}

    <div className={styles['company-profile-form-logo']}>
      <Uploader className={styles['company-profile-form-logo-uploader']} {...uploadProps}>
        <img src={company.images && company.images.length ? company.images[0].src : CompanyLogoPlaceholder.src} className={styles['company-profile-form-logo-image']} />
      </Uploader>
    </div>

    <TextInputField value={formValues.name} placeholder={t('labels.name')} label={t('labels.name')}  error={isSubmitted && errors && errors.name} onChange={handleName}  name='name' type='text' className={styles['company-profile-form-field']} />

    <button className={styles['company-profile-form-submit']} disabled={loading} type="submit">{!loading ? t('actions.save') : t('status.loading')}</button>
  </form> : <Preloader />
}

export default CompanyProfileForm;
