import useForm from 'libs/use-form';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import { useSite } from 'libs/site';
import PlusIcon from 'components/Icon/PlusIcon'
import { saveCollectionDocument } from 'libs/firestore';
import Preloader from 'components/Preloader/Preloader';
import Alert from 'components/Alert/Alert';
import { useState, useEffect } from 'react';
import { ctxError } from 'libs/helper';
import { useUser } from 'libs/user';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';

import styles from './criteria-option-form.module.scss';

const defaultValues = {
  name: '',
  desc: ''
}

const rules = {
  name: 'required',
  type: 'required'
}

const messages = {

}

const CriteriaOptionForm = ({ className, onValues, criteria }) => {
  const [values, errors, control] = useForm({ values: {
    ...defaultValues,
    type: criteria.id
  }, rules, messages })
  const [config, t] = useSite()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async () => {
    setLoading(true);

    values.companyId = user.companyId;

    try {
      const id = await saveCollectionDocument('criteriaOptions', values)

      onValues({
        ...values,
        id
      })
    } catch (error) {
      setError(ctxError('Creating option failed.', error));
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  return <form data-test-id="criteria-option-form" method="POST" noValidate className={classNames(styles['criteria-option-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <h2 className={styles['criteria-option-form-title']}>{criteria.name} option</h2>
    {error ? <Alert type="error">{error.message}</Alert> : null}
    <TextInputField value={values.name} placeholder={t('Name')} error={errors ? t(errors.name) : null} onChange={control.input('name')} autoComplete='off' name="name" className={styles['criteria-option-form-field']} />
    <TextareaInputField value={values.desc} placeholder={t('Definition (optional)')} error={errors ? t(errors.desc) : null} onChange={control.input('desc')} name="desc" className={styles['criteria-option-form-field']} />
    <PlatformButton disabled={loading} type="submit" className={styles['criteria-option-form-submit']}>
      {!loading ?
      <><PlusIcon /> Add option</> :
      'Loading...'
      }
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default CriteriaOptionForm;
