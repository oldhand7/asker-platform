import { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';
import PencilIcon from 'components/Icon/PencilIcon';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';

import styles from './RuleInputField.module.scss';

const RuleInputField = ({ className, rule, index = 1, onChange }) => {
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState(null);

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

  const handleStepValue = (val, index) => {
    const newSteps = [
        ...rule.steps
    ]

    newSteps[index] = val;

    onChange({
      ...rule,
      steps: newSteps
    })
  }

  const handleRename = (ev) => {
    onChange({
      ...rule,
      name: ev.target.value
    })
  }

  return <ul className={styles['rule-input-field']}>
    <li ref={headRef} className={classNames(styles['rule-input-field-item'], styles['rule-input-field-head'])}>
      {!edit ? <button onClick={() => setEdit(true)} className={styles['rule-input-field-head-edit-button']}>
        <PencilIcon className={styles['rule-input-field-head-edit-button-icon']} />
      </button> : null}
      <span className={styles['rule-input-field-head-index']}>{index}</span>
      {
        !edit ?
        <span className={styles['rule-input-field-head-label']}>{rule.name}</span> :
        <TextInputField focus={true} placeholder="Name" error={errors && errors.name} value={rule.name} onChange={handleRename} className={styles['rule-input-field-head-input']} onEnter={editModeOff}/>
      }
    </li>
    {
      rule.steps ?
      rule.steps.map((step, index) => <li key={`rs${index}`} className={styles['rule-input-field-item']}>
        <HtmlInputField value={step.slice(0, 9000)} onChange={val => handleStepValue(val, index)} className={styles['rule-input-field-item-input']} placeholder="Write here" />
      </li>) : null
    }
  </ul>
}

export default RuleInputField;
