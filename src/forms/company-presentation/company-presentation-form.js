import Separator from 'components/Separator/Separator'
import TextareaInputField from 'components/TextareaInputField/TextareaInputField'
import FileDropInputField from 'components/FileDropInputField/FileDropInputField'
import useForm from 'libs/use-form';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import FileManager from 'components/FileManager/FileManager';

import styles from './company-presentation-form.module.scss';

const defaultValues = {
  notes: '',
  files: []
}

const rules = {
  notes: 'max:320',
  files: 'required|array|min:1'
}

const messages = {
  required: '* - required field'
}

const CompanyPresentationForm = ({ values, className, onValues, onError }) => {
  const [formValues, errors, control] = useForm({
    values: values ? values : defaultValues,
    rules,
    messages,
    pristine: false
  })

  const handleFiles = (newFiles) => {
    control.set('files', [
      ...values.files,
      ...newFiles
    ])
  }

  useEffect(() => {
    if (!errors) {
      onValues(formValues)
    } else {
      onError(new Error("Form invalid"))
    }
  }, [errors, formValues])

  return <div className={classNames(className, styles['company-presentation-form'])}>
    <TextareaInputField error={errors && errors['notes']} className={classNames(styles['company-presentation-form-field'], styles['company-presentation-form-notes'])} name="notes" onChange={control.input('notes')} placeholder="Enter your introductory text" />
    <Separator className={styles['company-presentation-separator']} text="Or" />
    {
      formValues.files.length ?
      <FileManager className={styles['company-presentation-file-manager']} files={formValues.files} onChange={control.input('files', false)} /> :
      null
    }
    <FileDropInputField error={errors && errors['files']} label="Upload file" onFiles={handleFiles} className={styles['company-presentation-form-field']} />
  </div>
}

export default CompanyPresentationForm;
