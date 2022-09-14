
import Button from './Button';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from './PlatformButton.module.scss';

const PlatformButton = ({ children, className, ...props }, ref) => {
  return <Button ref={ref} {...props} className={classNames([
    styles['platform-button'],
    className
  ])}>{children}</Button>
}

export default forwardRef(PlatformButton);
