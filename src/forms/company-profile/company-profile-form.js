import useForm from 'libs/use-form';
import classNames from 'classnames';
import { sendContactMessage } from 'libs/api';
import Alert from 'components/Alert/Alert';
import { useState, useEffect } from 'react';
import TextInputField from 'components/TextInputField/TextInputField';
import Button from 'components/Button/Button';
import { useSite } from 'libs/site';
import { useUser } from 'libs/user';
import { useCompany } from 'libs/company'
import Preloader from 'components/Preloader/Preloader'
import Uploader from 'components/Uploader/Uploader';
import { uploadCompanyFile } from 'libs/firestorage';

import styles from './company-profile-form.module.scss';

import CompanyLogoPlaceholder from './assets/images/placeholder.png'

const defaultValues = {
  name: ''
}

const rules = {
  name: 'required'
}

const messages = {}

const CompanyProfileForm = ({ className }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [config, t] = useSite()
  const { user } = useUser()
  const [company, updateCompany] = useCompany(user && user.companyId)
  const [values, errors, control] = useForm({ values: company ? company : defaultValues, rules, messages })


  useEffect(() => {
    if (user) {
      updateCompany(user.companyId)
    }
  }, [user])

  useEffect(() => {
    if (company) {
      control.setValues({ ...company })
    }
  }, [company])

  useEffect(() => {
    if (errors) {
      setError(new Error(t('Form fields invalid.')))
    } else {
      setError(null);
    }
  }, [errors])

  const handleSubmit = () => {
    updateCompany(values)
      .then(() => {
        setSuccess(t('Company data updated!'));
      })
      .catch(error => {
        setError(new Error(`Company update failed: ${error.message}`))
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
            { src: imageURL, title: 'Logo'}
          ]
        });
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
    accept: "image/jpeg, image/png"
  }

  return company ? <form method="POST" noValidate className={classNames(styles['company-profile-form'], className)} onSubmit={control.submit(handleSubmit)}>
    {error ? <Alert className={styles['company-profile-form-alert']} type="error">{error.message}</Alert> : null}
    {success ? <Alert className={styles['company-profile-form-alert']} type="success">{success}</Alert> : null}

    <div className={styles['company-profile-form-logo']}>
      <Uploader className={styles['company-profile-form-logo-uploader']} {...uploadProps}>
        <img src={company.images && company.images.length ? company.images[0].src : CompanyLogoPlaceholder.src} className={styles['company-profile-form-logo-image']} />
      </Uploader>
    </div>

    <TextInputField value={values.name} placeholder={t('Name')} label={t('Name')}  error={errors ? t(errors.name) : null} onChange={control.input('name')}  name='name' type='text' className={styles['company-profile-form-field']} />

    <button className={styles['company-profile-form-submit']} disabled={loading} type="submit">{!loading ? t('Save') : t('Loading...')}</button>
  </form> : <Preloader />
}

export default CompanyProfileForm;
