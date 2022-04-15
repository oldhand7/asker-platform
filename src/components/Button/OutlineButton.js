
import Button from './Button';
import classNames from 'classnames';

import styles from './Button.module.scss';

const OutlineButton = ({ children, theme = 'green', className, ...props }) => {
  return <Button {...props} className={classNames([
    styles['button-outline'],
    styles[`button-outline-${theme}`],
    className
  ])}>{children}</Button>
}

export default OutlineButton;
