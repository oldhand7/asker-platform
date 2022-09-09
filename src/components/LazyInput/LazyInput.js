import classNames from 'classnames';
import { useState, useRef, useEffect, useCallback } from 'react';
import EditFieldIcon from 'components/Icon/EditFieldIcon';
import TextInput from 'components/TextInput/TextInput';

import styles from './LazyInput.module.scss';
import TextInputField from 'components/TextInputField/TextInputField';

const LazyInput = ({ className, label = 'Edit', showError=true, value = '', onChange, validate, beforeIcon, ...props}) => {
  const [mode, setMode] = useState('read');
  const [_value, setValue] = useState(value);
  const [error, setError] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ref = useRef();

  useEffect(() => {
    setValue(_value);
  }, [value])

  useEffect(() => {
    validate && setError(validate(_value))
  }, [_value, validate])

  const exitEditModeWithoutSaving = useCallback(() => {
    setValue(value)
    setMode('read')
  }, [])

  const exitEditModeSaving = useCallback(() => {
    if (!error) {
      setMode('read')
      onChange && onChange(_value)
    } else {
      setIsSubmitted(true);
    }
  }, [onChange, _value, error])

  useEffect(() => {
    !onChange && setMode('readonly')
  }, [onChange])

  useEffect(() => {
    if (mode != 'edit') return;

    const handleOffClick = ev => {
      if (ref && ref.current && ev.target != ref.current && !ref.current.contains(ev.target)) {
        exitEditModeSaving()
      }
    }

    document.body.addEventListener('click', handleOffClick, true)

    return () => {
      document.body.removeEventListener('click', handleOffClick, true);
    }
  }, [mode, exitEditModeSaving])

  const BeforeIcon = beforeIcon;

  return <div data-test-id={props['data-test-id']} ref={ref} onClick={() => onChange && setMode('edit')} className={classNames(
    styles['input'],
    className,
    styles[`input-${mode}`]
  )}>
    {
      mode == 'edit' ?
      <TextInputField showError={showError} error={isSubmitted && error}  focus={true} onEscape={exitEditModeWithoutSaving} onEnter={exitEditModeSaving} className={styles['input-input']} value={_value} onChange={e => setValue(e.target.value)} {...props}  /> :
      <> 
        {
          BeforeIcon ? <BeforeIcon className={styles['input-before-icon']} /> : null
        }
        <span className={styles['input-label']}>{label}</span>
        {onChange ? <EditFieldIcon className={styles['input-icon']} /> : ' '}
      </>
    }
  </div>
}

export default LazyInput;
