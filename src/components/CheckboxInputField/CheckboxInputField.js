import classNames from 'classnames';

import styles from './CheckboxInputField.module.scss'

const CheckboxInputField = ({ className, value, onChange, error, label = ''}) => {
  return <div className={classNames(styles['checkbox-input-field'], className)}>
    <label className={styles['checkbox-input-field-label']}>
      <input className={styles['checkbox-input-field-input']} type="checkbox" checked={value} onChange={onChange} />
      <span className={styles['checkbox-input-field-label-text']}>{label ? label : children}</span>
    </label>
    {error ? <p className="form-error">{error}</p> : null}
  </div>
}

export default CheckboxInputField;
