import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from './InputField.module.scss';

const InputField = ({ label = '', name = '', icon = null, children, error = null, id = '', className, component = null, showError = true, ...props }, customRef) => {
  const InputComponent = component;
  const IconComponent = icon;

  return <div className={classNames(styles['input'], error ? styles['input-field-error'] : '', className, icon ? styles['input-field-with-icon'] : '')}>
    {label ? <label className={styles['input-field-label']} htmlFor={id || `input-${name}`}>{label}</label> : null}

    <div className={styles['input-field-wrapper']}>
      {IconComponent ? <IconComponent className={styles['input-field-icon']} /> : null}
      {InputComponent ? <InputComponent id={id || `input-${name}`} className={styles['input-field-input']} {...props} name={name} ref={customRef} /> : children}
    </div>

    {error && showError ? <p className={classNames(styles['input-field-error'], 'form-error')}>{error}</p> : null}
  </div>
}

export default forwardRef(InputField);
