import TextInputField from 'components/TextInputField/TextInputField'
import classNames from 'classnames';

import styles from './PasswordInputField.module.scss';

const PasswordInputField = ({ className, ...props }) => {
  return <TextInputField className={classNames(styles['password-input-field'], className)} {...props} type="password" />
}

export default PasswordInputField;
