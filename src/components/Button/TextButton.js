import Button from './Button';
import classNames from 'classnames';

import styles from './Button.module.scss';

const TextButton = ({ children, className, type = 'button', ...props }) => {
  return <Button type={type} {...props} className={classNames([
    styles['button-text'],
    className
  ])}>{children}</Button>
}

export default TextButton;
