import TextareaInputField from 'components/TextareaInputField/TextareaInputField'
import useForm from 'libs/use-form';
import { useEffect } from 'react';
import classNames from 'classnames';

import styles from './summary-stage-form.module.scss';

const defaultValues = {
  text: ''
}

const rules = {
  text: 'max:320'
}

const messages = {
  max: 'Text is too long (320 characters max)'
}

const SummaryStageForm = ({ className, onValues, values, onError }) => {
  const [formValues, errors, control] = useForm({
    values: values ? values : defaultValues,
    rules,
    messages,
    pristine: false
  })

  useEffect(() => {
    if (!errors) {
      onValues && onValues(formValues)
    } else {
      onError(new Error("Form invalid"))
    }
  }, [errors, formValues])


  return <div className={classNames(className, styles['summary-stage-form'])}>
    <h3 className={styles['summary-stage-form-title']}>Summary text</h3>

    <TextareaInputField value={formValues.text} error={errors && errors['text']} className={styles['summary-stage-form-field']} name="text" onChange={control.input('text')} placeholder="Enter your summary text" />
  </div>
}

export default SummaryStageForm;
