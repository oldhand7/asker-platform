import HtmlInputField from 'components/HtmlInputField/HtmlInputField'
import useForm from 'libs/use-form';
import { useEffect } from 'react';
import classNames from 'classnames';

import styles from './summary-stage-form.module.scss';

const defaultValues = {
  text: '',
  html: ''
}

const rules = {
  html: 'max:10000'
}

const messages = {
  max: 'Text is too long'
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

    <HtmlInputField value={formValues.html || formValues.text} error={errors && errors['html']} className={styles['summary-stage-form-field']} name="html" onChange={control.input('html', false)} placeholder="Enter your summary text" />
  </div>
}

export default SummaryStageForm;
