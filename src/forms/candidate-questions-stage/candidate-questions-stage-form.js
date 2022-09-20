import classNames from 'classnames';
import InfoIcon from 'components/Icon/InfoIcon';
import { useForm } from 'libs/react-hook-form';
import { useEffect, useMemo, useCallback } from 'react';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import TimedTitle from 'components/TimedTitle/TimedTitle';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';

import styles from './candidate-questions-stage-form.module.scss';

const defaultValues = {
  time: 5,
  note: ''
}

const CandidateQuestionsStageForm = ({ values, onValues, onError, className }) => {
  const { t } = useTranslation();

  const initValues = useMemo(() => values || defaultValues, [])

  const {
    errors,
    setValue,
    control
  } = useForm({
    values: initValues
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  const handleTime = useCallback(val => {
    setValue('time', val)
  }, [setValue])

  const handleNote = useCallback(val => {
    setValue(`note`, val)
  }, [setValue])

  return <div className={classNames(styles['form'], className)}>
    <TimedTitle className={styles['form']}  time={formValues.time} onChange={handleTime}>
      {t('stages.candidate-questions.name-long')}
    </TimedTitle>

    <div className={styles['form-desc']}>
      <InfoIcon className={styles['form-desc-icon']} />
      <span className={styles['form-desc-text']}>{t('actions.remember-candidate')}</span>
    </div>
    <div className={styles['form-note']}>
      <span className={styles['form-note-label']}>{t('labels.notes-interviewer')}</span>
      <HtmlInputField focus={true} value={formValues.note} className={styles['form-note-input']} name="note" onChange={handleNote} placeholder={t("placeholders.enter-text")} />
    </div>
  </div>
}


export default CandidateQuestionsStageForm;
