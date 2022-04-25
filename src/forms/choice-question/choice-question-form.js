import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';
import { useEffect, useState } from 'react';
import useForm from 'libs/use-form';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import AnswersForm from 'forms/answers/answers-form';

import styles from './choice-question-form.module.scss'

const rules =  {
  name: 'required',
  desc: 'max:140',
  answers: 'required|min:1'
}

const ChoiceQuestionForm = ({ values, className, onValues, onCancel, loading, multichoice = false }) => {
  const [formValues, errors, control] = useForm({
    values,
    rules
  })

  const toggleQuestionType = () => {
    control.set('multichoice', !formValues.multichoice)
  }

  useEffect(() => {
    control.set('multichoice', multichoice)
  }, [multichoice])

  return <form data-test-id="choice-question-form" onSubmit={control.submit(onValues)} className={classNames(styles['choice-question-form'], className)}>
    <TextInputField error={errors && errors.name} className={styles['choice-question-form-field']} onChange={control.input('name')} value={formValues.name} label="Title" name='name' placeholder="ex: do you have a driver’s licence?" />
    <TextareaInputField error={errors && errors.desc} className={styles['choice-question-form-field']} onChange={control.input('desc')} value={formValues.desc} label="Description" name='desc' placeholder="Description" />

    <div>
      <AnswersForm values={formValues.answers} onValues={control.input('answers', false)} className={styles['choice-question-form-field']} title='Answers' />
      {errors && errors.answers ? <p className="form-error">{errors.answers}</p> : null}
    </div>

    <CheckboxInputField className={styles['choice-question-form-field']} value={formValues.multichoice} label="Allow multiple answers?" name="multichoice" onChange={toggleQuestionType}  />

    <div className={styles['choice-question-form-buttons']}>
    {
      !values.id ?
      <>
        <TextButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="button" onClick={onCancel}>Cancel</TextButton>
        <BrandishButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="submit">Create question</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['choice-question-form-buttons-button']} type="submit">Save question</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default ChoiceQuestionForm;
