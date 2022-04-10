import TextareaInput from 'components/TextareaInput/TextareaInput'
import InputField from 'components/InputField/InputField';
import classNames from 'classnames';

import styles from './TextareaInputField.module.scss';

const TextareaInputField = ({ className, ...props }) => {
  return <InputField className={classNames(styles['textarea-input-field'], className)} {...props} component={TextareaInput} />
}

export default TextareaInputField;
