import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PencilIcon from 'components/Icon/PencilIcon';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';

import styles from './RuleInputField.module.scss';
import { useUser } from 'libs/user';
import { useSite } from 'libs/site';
import { useForm } from 'libs/react-hook-form';

const defaultRule = { name: { en: ''}, step: [] }

const RuleInputField = ({ className, rule, index = 1, onChange }) => {
  const [edit, setEdit] = useState(false);
  const { locale } = useUser();

  const { t, i18nField } = useSite();

  const validationRules = useMemo(() => ({
    [`name.${locale}`]: 'required'
  }), [locale])

  const initialValue = useMemo(() => rule || defaultRule, [])

  const {
    values,
    errors,
    input
  } = useForm({
    values: rule,
    rules: validationRules
  });

  useEffect(() => {
    if (JSON.stringify(rule) != JSON.stringify(values)) {
      onChange && onChange(values)
    }
  }, [rule, values])

  const headRef = useRef();

  const editModeOff = useCallback(() => {
    if (!errors) {
      setEdit(false);
    }
  }, [errors])

  useEffect(() => {
    if (edit && headRef && headRef.current) {
      const handleOffClick = ev => {
        if (ev.target != headRef.current && !headRef.current.contains(ev.target)) {
          setEdit(false)
        }
      }

      document.body.addEventListener('click', handleOffClick)

      return () => {
        document.body.removeEventListener('click', handleOffClick)
      }
    }
  }, [edit, headRef, editModeOff])

  return <ul className={classNames(styles['rule-input-field'], className)}>
    <li ref={headRef} className={classNames(styles['rule-input-field-item'], styles['rule-input-field-head'])}>
      {!edit ? <button onClick={() => setEdit(true)} className={styles['rule-input-field-head-edit-button']}>
        <PencilIcon className={styles['rule-input-field-head-edit-button-icon']} />
      </button> : null}
      <span className={styles['rule-input-field-head-index']}>{index}</span>

      {
        !edit ?
        <span className={styles['rule-input-field-head-label']}>{i18nField(values.name)}</span> :
        <TextInputField focus={true} placeholder={t("Name")} error={errors && errors.name && errors.name[locale]} value={values.name[locale]} onChange={input(`name.${locale}`)} className={styles['rule-input-field-head-input']} onEnter={editModeOff}/>
      }
    </li>

    {
      values.steps ?
      values.steps.map((step, index) => <li key={`rs${index}-${locale}`} className={styles['rule-input-field-item']}>
        <HtmlInputField value={step[locale]} diff={locale} onChange={input(`steps.${index}.${locale}`, false)} className={styles['rule-input-field-item-input']} placeholder={t("Write here")} />
      </li>) : null
    }
  </ul>
}

export default RuleInputField;
