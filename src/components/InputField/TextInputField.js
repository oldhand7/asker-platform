import TextInput from 'components/TextInput/TextInput';
import classNames from 'classnames';

import styles from './InputField.module.scss';

const TextInputField = ({ focus = false, onChange, value = '', label = '', icon = null, error = null, placeholder='', name = '', autocomplete = '', type='text', className }) => {
  return <div className={classNames(styles['input'], error ? 'input-field-error' : '', className)}>
    {label ? <label className={styles['input-field-label']} htmlFor={`input-${name}`}>{label}</label> : null}

    <TextInput focus={focus} onChange={onChange} value={value} icon={icon} name={name} placeholder={placeholder ? placeholder : label} autocomplete={autocomplete} type={type} className={styles['input-field-input']} />

    {error ? <p className={styles['input-field-error']}>{error}</p> : null}
  </div>
}

export default TextInputField;
