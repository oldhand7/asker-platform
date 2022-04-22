import Separator from 'components/Separator/Separator'
import TextareaInputField from 'components/TextareaInputField/TextareaInputField'
import FileDropInputField from 'components/FileDropInputField/FileDropInputField'
import useForm from 'libs/use-form';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import FileManager from 'components/FileManager/FileManager';
import { BUNDLE_UPLOAD_LIMIT_MB, BUNDLE_MAX_FILES } from 'libs/config';
import { calcFileBundleSizeBytes } from 'libs/helper';

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

const sum = (sum, x) => sum + x

const CompanyPresentationForm = ({ values, className, onValues, onError }) => {
  const [formValues, errors, control] = useForm({
    values: values ? values : defaultValues,
    rules,
    messages,
    pristine: false
  })

  const [bundleReminingBytes, setBundleReminingBytes] = useState(0);

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


  useEffect(() => {
    const bundleSize = calcFileBundleSizeBytes(values.files);
    setBundleReminingBytes(BUNDLE_UPLOAD_LIMIT_MB * 1000000 - bundleSize)
  }, [values])

  return <div className={classNames(className, styles['company-presentation-form'])}>
    <TextareaInputField error={errors && errors['notes']} className={classNames(styles['company-presentation-form-field'], styles['company-presentation-form-notes'])} name="notes" onChange={control.input('notes')} placeholder="Enter your introductory text" />
    <Separator className={styles['company-presentation-separator']} text="Or" />
    {
      formValues.files.length ?
      <FileManager className={styles['company-presentation-file-manager']} files={formValues.files} onChange={control.input('files', false)} /> :
      null
    }

    {
      bundleReminingBytes > 0 && formValues.files.length < BUNDLE_MAX_FILES ?
      <FileDropInputField bundleReminingBytes={bundleReminingBytes} error={errors && errors['files']} label="Upload file" onFiles={handleFiles} multiple={false} className={styles['company-presentation-form-field']} /> :
      <p className={styles['company-presentation-form-warning']}>
        <small>You have reached file upload limit. Delete files to continue.</small>
      </p>
    }
  </div>
}

export default CompanyPresentationForm;
