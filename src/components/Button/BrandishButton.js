import Button from './Button';
import classNames from 'classnames';

import styles from './Button.module.scss';

const BrandishButton = ({ children, className,  ...props }) => {
  return <Button {...props}  className={classNames([
    styles['button-brandish'],
    className
  ])}>{children}</Button>
}

export default BrandishButton;
