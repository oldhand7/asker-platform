import Button from './Button';
import classNames from 'classnames';

import styles from './Button.module.scss';

const TryButton = ({ children, className, ...props }) => {
  return <Button {...props} className={classNames([
    styles['button-try'],
    className
  ])}>{children}</Button>
}

export default TryButton;
