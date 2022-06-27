import HtmlInputField from 'components/HtmlInputField2/HtmlInputField'
import useForm from 'libs/use-form';
import { useEffect } from 'react';
import classNames from 'classnames';

import styles from './introduction-stage-form.module.scss';

const defaultValues = {
  text: '',
  html: ''
}

const rules = {
  html: 'max:9000',
}

const messages = {
  max: 'Text is too long'
}

const IntroductionStageForm = ({ className, onValues, values, onError }) => {
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


  return <div className={classNames(className, styles['introduction-stage-form'])}>
    <h3 className={styles['introduction-stage-form-title']}>Introduction text</h3>
    <HtmlInputField focus={true} value={formValues.html || formValues.text} error={errors && errors['html']} className={classNames(styles['introduction-stage-form-field'], styles['introduction-stage-form-text'])} name="html" onChange={control.input('html', false)} placeholder="Enter your introduction text" />
  </div>
}

export default IntroductionStageForm;
