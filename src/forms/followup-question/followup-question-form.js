import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import OutlineButton from 'components/Button/OutlineButton';
import PlusIcon from 'components/Icon/PlusIcon';
import {useForm} from 'libs/react-hook-form'
import { useMemo, useState } from 'react';

import styles from './followup-question-form.module.scss';
import { useSite } from 'libs/site';
import { useUser } from 'libs/user';

const defaultValues = {
  name: {
    en: ''
  }
}

const FollowupQuestionForm = ({ question, className, onValues }) => {
  const { t } = useSite();
  const { locale } = useUser();

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required|max:9000'
  }), [locale])

  const validationMessages = useMemo(() => ({
    [`required name.${locale}`]: 'required|max:9000'
  }), [locale])

  const { values, errors, input, reset, handleSubmit, isSubmitted } = useForm({
    values: question ? question : defaultValues,
    rules: validationRules,
    messages: validationMessages
  })

  const [pristine, setPristine] = useState(true);

  const onSubmit = (values) => {
    onValues(values)

    setTimeout(() => {
      reset({
        name: {
          en: ''
        }
      }, { keepIsSubmitted: false})
    }, 0)
  }

  return <div className={classNames(styles['followup-question-form'], className)}>
    {
      !pristine ?
      <TextInputField value={values.name[locale]} onEnter={handleSubmit(onSubmit)} className={styles['followup-question-form-input-field']} name={`name.${locale}`} autoComplete="off" onChange={input(`name.${locale}`)} error={errors && errors.name && errors.name[locale]} placeholder={t("E.g. What was your responsibility?")} /> :
      <OutlineButton type="button" disabled={errors} onClick={() => setPristine(false)} className={styles['followup-question-form-submit']}><PlusIcon /> {t('Add new follow-up question')}</OutlineButton>
    }
  </div>
}

export default FollowupQuestionForm;
