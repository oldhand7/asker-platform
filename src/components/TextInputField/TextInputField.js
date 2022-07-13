import TextInput from 'components/TextInput/TextInput'
import InputField from 'components/InputField/InputField';
import { forwardRef } from 'react';
import classNames from 'classnames';

import styles from './TextInputField.module.scss';

const TextInputField = ({ className, ...props }, customRef) => {
  return <InputField ref={customRef} className={classNames(styles['text-input-field'], className)} {...props} component={TextInput} />
}

export default forwardRef(TextInputField);
