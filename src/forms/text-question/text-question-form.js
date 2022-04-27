import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';
import { useEffect, useState } from 'react';
import useForm from 'libs/use-form';

import styles from './text-question-form.module.scss'

const rules =  {
  name: 'required',
  desc: 'max:140'
}

const TextQuestionForm = ({ values, className, onValues, onCancel, loading }) => {
  const [formValues, errors, control] = useForm({
    values,
    rules
  })

  return <form data-test-id="text-question-form" onSubmit={control.submit(onValues)} className={classNames(styles['text-question-form'], className)}>
    <TextInputField error={errors && errors.name} className={styles['text-question-form-field']} onChange={control.input('name')} value={formValues.name} label="Title" name='name' placeholder="ex: do you have a driver’s licence?" />
    <TextareaInputField error={errors && errors.desc} className={styles['text-question-form-field']} onChange={control.input('desc')} value={formValues.desc} label="Description" name='desc' placeholder="Description" />

    <div className={styles['text-question-form-buttons']}>
    {
      !values.id ?
      <>
        <TextButton disabled={loading} className={styles['text-question-form-buttons-button']} type="button" onClick={onCancel}>Cancel</TextButton>
        <BrandishButton disabled={loading} className={styles['text-question-form-buttons-button']} type="submit">Create question</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['text-question-form-buttons-button']} type="submit">Save question</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default TextQuestionForm;
