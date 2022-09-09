import { useState, useEffect, useRef, useCallback, useMemo,memo } from 'react';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PencilIcon from 'components/Icon/PencilIcon';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import { useForm } from 'libs/react-hook-form';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useTranslation } from 'libs/translation';

import styles from './RuleInputField.module.scss';

const defaultRule = {
  name: { en: 'Basic'},
  steps: [
    { en: ''},
    { en: ''},
    { en: ''}
  ]
}

export const createRule = (name = 'Basic', steps = 0) => {
  const copy = JSON.parse(JSON.stringify(defaultRule))

  copy.name.en = name;
  copy.steps = Array(steps).fill({ en: ''})

  return copy;
}

const RuleInputField = ({ className, rule, index = 0, onChange, onError }) => {
  const [mode, setMode] = useState('none');
  const { locale } = useRouter();
  const { t, i18nField } = useTranslation();
  const headRef = useRef();

  const validationRules = useMemo(() => ({
    [`copy.name.${locale}`]: 'required'
  }), [locale])

  const validationMessages = useMemo(() => ({
    'required': t('errors.name.invalid')
  }), [locale])

  const initValue = useMemo(() => ({
    rule: rule || defaultRule,
    copy: rule || defaultRule
  }), [])

  const {
    errors,
    values: formValues,
    setValue,
    control
  } = useForm({
    values: initValue,
    rules: validationRules,
    messages: validationMessages
  });

  const { fields: steps, update: updateStep }  = useFieldArray({
    control,
    name: 'rule.steps',
    keyName: '_id'
  })

  const ruleObserved = useWatch({
    control,
    name: "rule",
    defaultValue: initValue.rule
  });

  useEffect(() => {
    onChange && onChange(ruleObserved)
  }, [ruleObserved, onChange])

  useEffect(() => {
    onError && onError(errors && new Error(t('errors.name.invalid')))
  }, [errors, onError])

  const enterNameEditMode = () => {
    setValue('copy', JSON.parse(JSON.stringify(formValues.rule)))
    setMode('edit');
  }

  const exitEditMode = useCallback(() => {
    setMode('none');
  }, [setMode])

  const exitEditModeSaving = () => {
    if (!errors) {
      setValue('rule.name', formValues.copy.name)
      setMode('none');
    }
  }

  useEffect(() => {
    if (mode == 'edit' && headRef && headRef.current) {
      const handleOffClick = ev => {
        if (ev.target != headRef.current && !headRef.current.contains(ev.target)) {
          setMode('none')
        }
      }

      document.body.addEventListener('click', handleOffClick)

      return () => {
        document.body.removeEventListener('click', handleOffClick)
      }
    }
  }, [mode])

  const handleName = useCallback(ev => {
    setValue(`copy.name.${locale}`, ev.target.value)
  }, [locale, setValue])

  return <ul className={classNames(styles['rule-input-field'], className)}>
    <li ref={headRef} className={classNames(styles['rule-input-field-item'], styles['rule-input-field-head'])}>
      {mode != 'edit' ? <button title={t('actions.edit.name')} onClick={enterNameEditMode} className={styles['rule-input-field-head-edit-button']}>
        <PencilIcon className={styles['rule-input-field-head-edit-button-icon']} />
      </button> : null}
      <span className={styles['rule-input-field-head-index']}>{index+1}</span>

      {
        mode == 'edit' ?
        <TextInputField focus={true} placeholder={t("labels.name")} error={errors && errors.copy && errors.copy.name && errors.copy.name[locale]} value={formValues.copy.name[locale]} onChange={handleName} className={styles['rule-input-field-head-input']} onEnter={exitEditModeSaving} onEscape={exitEditMode} /> :
        <span className={styles['rule-input-field-head-label']}>{i18nField(formValues.rule.name)}</span>
      }
    </li>

    {steps.map((step, index) => {
      const handleStepChange = (value) => {
        updateStep(index, { ...step, [locale]: value})
      }

      return <li key={`rs${index}-${locale}`} className={styles['rule-input-field-item']}>
        <HtmlInputField value={step[locale]} diff={locale} onChange={handleStepChange} className={styles['rule-input-field-item-input']} placeholder={t('actions.write-here')} />
    </li>
    })}
  </ul>
}

export default memo(RuleInputField);
