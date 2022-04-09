
import Button from './Button';
import classNames from 'classnames';

import styles from './PlatformButton.module.scss';

const PlatformButton = ({ children, className, ...props }) => {
  return <Button {...props} className={classNames([
    styles['platform-button'],
    className
  ])}>{children}</Button>
}

export default PlatformButton;
