import useForm from 'libs/use-form';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import PlusIcon from 'components/Icon/PlusIcon'
import { saveCollectionDocument } from 'libs/firestore';
import Preloader from 'components/Preloader/Preloader';
import Alert from 'components/Alert/Alert';
import { useState, useEffect } from 'react';
import { ctxError } from 'libs/helper';
import { useUser } from 'libs/user';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField'

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

const CriteriaOptionForm = ({ className, onValues, values, type }) => {
  const [formValues, errors, control] = useForm({ values: values ? values : {
    ...defaultValues,
    type: type.id
  }, rules, messages })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async () => {
    setLoading(true);

    formValues.companyId = user.companyId;

    try {
      const id = await saveCollectionDocument('criteriaOptions', formValues)

      onValues({
        ...formValues,
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
    <h2 className={styles['criteria-option-form-title']}>{type.name} option</h2>
    {error ? <Alert type="error">{error.message}</Alert> : null}
    <TextInputField value={formValues.name} placeholder={'Name'} error={errors ? errors.name : null} onChange={control.input('name')} autoComplete='off' name="name" className={styles['criteria-option-form-field']} />
    {
      type.id == 'competency' ?
      <HtmlInputField value={formValues.desc} placeholder={'Definition (optional)'} error={errors ? errors.desc : null} onChange={control.input('desc', false)} name="desc" className={styles['criteria-option-form-field']} /> :
      null
    }
    <PlatformButton disabled={loading} type="submit" className={styles['criteria-option-form-submit']}>
      {!loading ?
      (!formValues.id ? <><PlusIcon />  Add option</> : 'Save option') :
      'Loading...'
      }
    </PlatformButton>
    {loading ? <Preloader /> : null}
  </form>
}

export default CriteriaOptionForm;
