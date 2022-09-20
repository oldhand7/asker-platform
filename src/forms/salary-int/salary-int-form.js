import {useForm} from 'libs/react-hook-form'
import { useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import TextInputField from 'components/TextInputField/TextInputField';
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import DismissAlert from 'components/DismissAlert/DismissAlert';
import Html from 'components/Html/Html';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'libs/translation';

import styles from './salary-int-form.module.scss';

const defaultValues = {
  range: false,
  min: '',
  max: '',
  notes: ''
}

const validationRules = {}

const SalaryIntForm = ({ className, values, markComplete, onValues, config, onError }) => {
  const { t } = useTranslation()

  const initValues = useMemo(() => values || defaultValues, [])

  const {
    errors,
    input,
    setValue,
    formState: { isDirty },
    control
  } = useForm({
    values: initValues,
    rules: validationRules
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  useEffect(() => isDirty && markComplete && markComplete(), [isDirty])

  useEffect(() => {
    onValues && onValues(formValues)
  }, [formValues, onValues])

  useEffect(() => {
    onError && onError(errors && new Error(t("errors.form.invalid")))
  }, [errors, onError])

  const handleMin = useCallback(ev => {
    setValue('min', ev.target.value)
  }, [setValue])

  const handleMax = useCallback(ev => {
    setValue('max', ev.target.value)
  }, [setValue])

  const handleNotes = useCallback(val => {
    setValue('notes', val)
  }, [setValue])

  return <div className={classNames(styles['form'], className)}>
      <div className={styles['form-group']}>
        <h2 className={styles['form-title']}>{t('stages.salary.name')}</h2>

        <div className={styles['form-expo']}>
          <h5 className={styles['form-expo-title']}>{t('labels.budget-range')}:</h5>
          <div className={styles['form-expo-range']}>
            <span className={styles["form-expo-range-value"]}>{config.min}</span><span className={styles["form-expo-range-divider"]}> - </span><span className={styles["form-expo-range-value"]}>{config.max}</span>
          </div>
        </div>

        <div className={styles['form-input']}>
          <h5 className={styles['form-input-label']}>{t('labels.requested-salary')}</h5>
          <div className={styles['form-input-range']}>
            <span className={styles['form-input-range-divider-text']}>{t('labels.from')}</span>
            <TextInputField placeholder={config.min} className={styles['form-input-input']} name="min" onChange={handleMin} value={formValues.min} />
            {formValues.range && <>
              <span className={styles['form-input-range-divider-text']}>- {t('labels.to')}</span>
              <TextInputField placeholder={config.max} className={styles['form-input-input']} name="max" onChange={handleMax} value={formValues.max} />
            </>}
          </div>

          <CheckboxInputField className={styles['form-input-checkbox']} label={t('actions.add.salary-range')} checked={formValues.range} onChange={() => setValue('range', !formValues.range)} />
        </div>
      </div>
      <div className={styles['form-group']}>
        <HtmlInputField className={styles['form-notes']} value={formValues.notes} onChange={handleNotes} placeholder={t('placeholders.notes-salary')}  />
 
        {config.note && !formValues.alertDismissed ?
        <DismissAlert className={styles['form-alert']} onDismiss={() => setValue('alertDismissed', true)}>
          <Html>{config.note}</Html>
        </DismissAlert> : null}
      </div>
  </div>
}

export default SalaryIntForm;
