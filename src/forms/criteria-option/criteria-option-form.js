import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import PlusIcon from 'components/Icon/PlusIcon'
import { saveCollectionDocument } from 'libs/firestore';
import Preloader from 'components/Preloader/Preloader';
import Alert from 'components/Alert/Alert';
import { useState, useEffect, useMemo } from 'react';
import { ctxError } from 'libs/helper';
import { useUser } from 'libs/user';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField'
import { useForm } from 'libs/react-hook-form'

import styles from './criteria-option-form.module.scss';
import { useSite } from 'libs/site';

const CRITERIA_LABELS = {
  'competency': 'Competency option',
  'experience': 'Experience option',
  'hard-skill': 'Hard skill option'
}

const defaultValues = {
  name: {
    en: ''
  },
  desc: {
    en: ''
  }
}

const CriteriaOptionForm = ({ className, onValues, values, type }) => {
  const { user, locale } = useUser();
  const { t } = useSite()

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required',
    type: 'required'
  }), [locale])

  const { values: formValues, errors, input, handleSubmit } = useForm({ values: values ? values : {
    ...defaultValues,
    type
  }, rules: validationRules })


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    data.companyId = user.companyId;

    try {
      const id = await saveCollectionDocument('criteriaOptions', data)

      onValues({
        ...data,
        id
      })
    } catch (error) {
      setError(ctxError('Creating option failed.', error));
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  return <form data-test-id="criteria-option-form" method="POST" noValidate className={classNames(styles['criteria-option-form'], className)} onSubmit={handleSubmit(onSubmit)}>
   <h2 className={styles['criteria-option-form-title']}>{t(CRITERIA_LABELS[type])}</h2>

    {error ? <Alert type="error">{error.message}</Alert> : null}

    <TextInputField value={formValues.name[locale]} placeholder={t('Name')} error={errors && errors.name && errors.name[locale]} onChange={input(`name.${locale}`)} autoComplete='off' name={`name.${locale}`} className={styles['criteria-option-form-field']} />
    {
      type == 'competency' ?
      <HtmlInputField value={formValues.desc[locale]} placeholder={`${t('Definition')} (${t('optional')})`} error={errors ? errors.desc : null} onChange={input(`desc.${locale}`, false)} name={`desc.${locale}`} className={styles['criteria-option-form-field']} /> :
      null
    }
    <PlatformButton disabled={loading} type="submit" className={styles['criteria-option-form-submit']}>
      {!loading ?
      (!formValues.id ? <><PlusIcon />  {t('Add option')}</> : t('Save option')) :
      t('Loading...')
      }
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default CriteriaOptionForm;
