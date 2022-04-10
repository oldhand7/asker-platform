import classNames from 'classnames';

import styles from './InputField.module.scss';

const InputField = ({ label = '', name = '', icon = null, children, error = null, className, component = null, ...props }) => {
  const InputComponent = component;
  const IconComponent = icon;

  return <div className={classNames(styles['input'], error ? 'input-field-error' : '', className, icon ? styles['input-field-with-icon'] : '')}>
    {label ? <label className={styles['input-field-label']} htmlFor={`input-${name}`}>{label}</label> : null}

    <div className={styles['input-field-wrapper']}>
      {IconComponent ? <IconComponent className={styles['input-field-icon']} /> : null}
      {InputComponent ? <InputComponent className={classNames(styles['input-field-input'], className)} {...props} name={name} /> : children}
    </div>

    {error ? <p className={styles['input-field-error']}>{error}</p> : null}
  </div>
}

export default InputField;
