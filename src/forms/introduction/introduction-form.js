import Separator from 'components/Separator/Separator'
import TextareaInputField from 'components/TextareaInputField/TextareaInputField'
import FileDropInputField from 'components/FileDropInputField/FileDropInputField'
import useForm from 'libs/use-form';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import styles from './introduction-form.module.scss';

const defaultValues = {
  text: ''
}

const rules = {
  text: 'max:320'
}

const messages = {
  max: 'Text is too long (320 characters max)'
}

const IntroductionForm = ({ className, onValues, values, onError }) => {
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


  return <div className={classNames(className, styles['introduction-form'])}>
    <TextareaInputField value={formValues.text} error={errors && errors['text']} className={classNames(styles['introduction-form-field'], styles['introduction-form-text'])} name="text" onChange={control.input('text')} placeholder="Enter your introduction text" />
  </div>
}

export default IntroductionForm;