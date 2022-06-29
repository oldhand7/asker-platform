import classNames from 'classnames';

import styles from './RadioInputField.module.scss'

const RadioInputField = ({ className, checked = false, value, error, onChange, label = '' , ...props }) => {
  return <div className={classNames(styles['checkbox-input-field'], className)}>
    <label className={styles['checkbox-input-field-label']}>
      <input className={styles['checkbox-input-field-input']} type="radio" value={value} defaultChecked={checked} onChange={onChange} {...props} />
      <span className={styles['checkbox-input-field-label-text']}>{label ? label : null}</span>
    </label>
    {error ? <p className="form-error">{error}</p> : null}
  </div>
}

export default RadioInputField;
