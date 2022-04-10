import Separator from 'components/Separator/Separator'
import TextareaInputField from 'components/TextareaInputField/TextareaInputField'
import FileDropInputField from 'components/FileDropInputField/FileDropInputField'
import useForm from 'libs/use-form';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import styles from './company-presentation-form.module.scss';

const defaultValues = {
  notes: '',
  files: null
}

const rules = {
  notes: 'max:320',
  files: 'required|array|min:1'
}

const messages = {
  required: '* - required field'
}

const CompanyPresentationForm = ({ className, onValues, onError }) => {
  const [values, errors, control] = useForm({
    values: defaultValues,
    rules,
    messages,
    pristine: false
  })

  const handleFiles = (files) => {
    //@TODO
  }

  useEffect(() => {
    if (!errors) {
      onValues(values)
    } else {
      onError(new Error("Form invalid"))
    }
  }, [errors, values])

  return <div className={classNames(className, styles['company-presentation-form'])}>
    <TextareaInputField error={errors && errors['notes']} className={classNames(styles['company-presentation-form-field'], styles['company-presentation-form-notes'])} name="notes" onChange={control.input('notes')} placeholder="Enter your introductory text" />
    <Separator className={styles['company-presentation-separator']} text="Or" />
    <FileDropInputField error={errors && errors['files']} onChange label="Upload file" onChange={handleFiles} className={styles['company-presentation-form-field']} />
  </div>
}

export default CompanyPresentationForm;
