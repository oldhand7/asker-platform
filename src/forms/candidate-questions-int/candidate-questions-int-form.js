import classNames from 'classnames';
import DismissAlert from 'components/DismissAlert/DismissAlert';
import Html from 'components/Html/Html';
import { useForm } from 'libs/react-hook-form';
import { useMemo, useEffect, useCallback } from 'react';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';

import styles from './candidate-questions-int-form.module.scss';

const defaultValues = {
  notes: '',
  alertDismissed: false
}

const CandidateQuestionsIntForm = ({ className, values, onValues, onError, config }) => {
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

  const handleNotes = useCallback(notes => {
    setValue(`notes`, notes)
  }, [setValue])

  return <div className={classNames(styles['form'], className)}>
    <h2 className={styles['form-title']}>{t('stages.candidate-questions.name')}</h2>

    <div className={styles['form-desc']}>
      {t('headings.time-for-candidate-questions')}
    </div>

    {config && config.note && !formValues.alertDismissed ?
      <DismissAlert className={styles['form-alert']} onDismiss={() => setValue('alertDismissed', true)}>
        <Html>{config.note}</Html>
      </DismissAlert> : null}

    <HtmlInputField value={formValues.notes} className={styles['form-notes']} name="notes" onChange={handleNotes} placeholder={t("placeholders.enter-text")} />
  </div>
}

export default CandidateQuestionsIntForm;
