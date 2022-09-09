import Separator from 'components/Separator/Separator'
import HtmlInputField from 'components/HtmlInputField/HtmlInputField'
import FileDropInputField from 'components/FileDropInputField/FileDropInputField'
import {useForm} from 'libs/react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import FileManager from 'components/FileManager/FileManager';
import { BUNDLE_UPLOAD_LIMIT_MB, MAX_TOTAL_FILES, DEFAULT_STAGE_TIME } from 'libs/config';
import { calcFileBundleSizeBytes } from 'libs/helper';
import { useMemo } from 'react';
import TimedTitle from 'components/TimedTitle/TimedTitle';
import { useRouter } from 'next/router';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';

import styles from './company-presentation-stage-form.module.scss';

const defaultValues = {
  notes: '',
  files: [],
  time: DEFAULT_STAGE_TIME
}

const validationRules = {
  notes: 'max:9000',
  files: 'array'
}

const CompanyPresentationStageForm = ({ values, className, onValues, onError, isSubmitted, test = 0}) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const initValues = useMemo(() => values || defaultValues, [])

  const validationMessages = useMemo(() => ({
    required: t('errors.field.required')
  }), [locale])

  const {
    errors,
    setValue,
    control
  } = useForm({
    values: initValues,
    rules: validationRules,
    messages: validationMessages
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  const {
    fields: formFiles,
    append: addFile
  } = useFieldArray({ control, name: 'files', keyName: '_id' })

  const [bundleReminingBytes, setBundleReminingBytes] = useState(0);

  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  useEffect(() => {
    const bundleSize = calcFileBundleSizeBytes(formFiles);
    setBundleReminingBytes(BUNDLE_UPLOAD_LIMIT_MB * 1000000 - bundleSize)
  }, [formFiles])

  const handleIncomingFiles = useCallback((files) => {
      addFile(files)
  }, [addFile])

  const handleFiles = useCallback((files) => {
    setValue('files', files)
  }, [setValue])

  const handleTimeChange = useCallback((time) => {
    setValue('time', time)
  }, [setValue])

  const handleNotes = useCallback((notes) => {
    setValue('notes', notes)
  }, [setValue])

  return <div className={classNames(className, styles['form'])}>
    <TimedTitle className={styles['fromt-title']} time={formValues.time} onChange={handleTimeChange}>
      {t('headings.company-presentation')}
    </TimedTitle>

    <HtmlInputField value={formValues.notes} error={isSubmitted && errors && errors['notes']} className={classNames(styles['form-field'], styles['form-notes'])} name="notes" onChange={handleNotes} placeholder={t("placeholders.company-text")} />
   
    <Separator className={styles['form-separator']} text={t('labels.or')} />
    
    {formFiles.length > 0 && <FileManager className={styles['form-file-manager']} files={formFiles} onChange={handleFiles} />}

    {
      bundleReminingBytes > 0 && formFiles.length < MAX_TOTAL_FILES ?
      <FileDropInputField maxFilesPerUpload={Math.max(MAX_TOTAL_FILES - formFiles.length, 0)} bundleReminingBytes={bundleReminingBytes} error={errors && errors['files']} label={t('labels.upload-file')} onFiles={handleIncomingFiles} multiple={true} className={styles['form-field']} /> :
      <p className={styles['form-warning']}>
        <small>{t('errors.file.limit')}</small>
      </p>
    }
  </div>
}

export default CompanyPresentationStageForm;
