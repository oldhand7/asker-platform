import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from './Button.module.scss';

const StandardButton = forwardRef(({ className, children, onClick, ...props }, ref) => {
  return <button ref={ref} className={classNames(styles['button'], className)} onClick={onClick} {...props}>
    {children}
  </button>
})

StandardButton.displayName = 'StandardButton'

const LinkButton = forwardRef(({ children, href = '#', target='', className }, ref) => {
  return <a ref={ref} href={href} target={target} className={classNames(styles['button'], className)}>
  {children}
  </a>
})

LinkButton.displayName = 'LinkButton'

const Button = (props, ref) => {
  if (props.href) {
    return <LinkButton ref={ref} {...props} />
  }

  return <StandardButton ref={ref} {...props} />
}

const ButtonFowarded = forwardRef(Button)

ButtonFowarded.displayName = 'Button';

export default ButtonFowarded;
