import TextInput from 'components/TextInput/TextInput'
import InputField from 'components/InputField/InputField';
import classNames from 'classnames';

import styles from './TextInputField.module.scss';

const TextInputField = ({ className, ...props }) => {
  return <InputField className={classNames(styles['text-input-field'], className)} {...props} component={TextInput} />
}

export default TextInputField;
