import Button from './Button';
import classNames from 'classnames';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';

import styles from './Button.module.scss';

const PrevButton = ({ children, className, text = 'Prev step',  ...props }) => {
  return <Button {...props} type="button" className={classNames([
    styles['button-prev'],
    className
  ])}><ArrowDownIcon className={styles['button-prev-icon']} /> {text}</Button>
}

export default PrevButton;
