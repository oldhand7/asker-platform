import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import OutlineButton from 'components/Button/OutlineButton';
import PlusIcon from 'components/Icon/PlusIcon';
import useForm from 'libs/use-form';
import { useState } from 'react';

import styles from './followup-question-form.module.scss';

const defaultValues = {
  name: ''
}

const validationRules = {
  name: 'required|max:9000'
}

const validationMessages = {}

const FollowupQuestionForm = ({ question, className, onValues }) => {
  const [values, errors, control] = useForm({
    values: question ? question : defaultValues,
    rules: validationRules,
    messages: validationMessages
  })

  const [pristine, setPristine] = useState(true);

  const handleSubmit = (values) => {
    onValues(values)
    control.reset()
  }

  return <div className={classNames(styles['followup-question-form'], className)}>
    {
      !pristine ?
      <TextInputField value={values.name} onEnter={control.submit(handleSubmit)} className={styles['followup-question-form-input-field']} name="name" autoComplete="off" onChange={control.input('name')} error={errors && errors.name} placeholder="E.g. What was your responsibility?" /> :
      <OutlineButton type="button" disabled={errors} onClick={() => setPristine(false)} className={styles['followup-question-form-submit']}><PlusIcon /> Add new follow-up question</OutlineButton>
    }
  </div>
}

export default FollowupQuestionForm;
