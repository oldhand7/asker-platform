import classNames from 'classnames';

import styles from './Button.module.scss';

const StandardButton = ({ className, children, onClick, ...props }) => {
  return <button className={classNames(styles['button'], className)} onClick={onClick} {...props}>
    {children}
  </button>
}

const LinkButton = ({ children, href = '#', target='', className }) => {
  return <a href={href} target={target} className={classNames(styles['button'], className)}>
  {children}
  </a>
}

const Button = props => {
  if (props.href) {
    return <LinkButton {...props} />
  }

  return <StandardButton {...props} />
}


export default Button;
