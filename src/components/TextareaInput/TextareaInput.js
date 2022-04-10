import classNames from 'classnames';

import styles from './TextareaInput.module.scss';

const TextareaInput = ({ className, ...props }) => {
  return <textarea className={classNames(styles['textarea-input'], className)} {...props}></textarea>
}

export default TextareaInput;
