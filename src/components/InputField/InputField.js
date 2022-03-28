import TextInput from 'components/TextInput/TextInput';
import classNames from 'classnames';

import styles from './InputField.module.scss';

//@TODO: move input out
//@TODO: add textarea support

const InputField = ({ onChange, value = '', label = '', icon = null, error = null, placeholder='', name = '', autocomplete = '', type='text', className }) => {
  return <div className={classNames(styles['input'], error ? 'input-field-error' : '', className)}>
    {label ? <label className={styles['input-field-label']} htmlFor={`input-${name}`}>{label}</label> : null}

    {
      type == 'textarea' ?
      <textarea className={styles['input-field-textarea']} id={`input-${name}`} value={value} onChange={onChange} /> :
      null
    }

    {
      type == 'text' || type == 'email' ?
      <TextInput onChange={onChange} value={value} icon={icon} name={name} placeholder={placeholder} autocomplete={autocomplete} type={type} className={styles['input-field-input']} /> :
      null
    }

    {error ? <p className={styles['input-field-error']}>{error}</p> : null}
  </div>
}

export default InputField;
