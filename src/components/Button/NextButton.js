import Button from './Button';
import classNames from 'classnames';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';

import styles from './Button.module.scss';

const NextButton = ({ children, className, text = 'Next question',  ...props }) => {
  return <Button {...props} type="button" className={classNames([
    styles['button-next'],
    className
  ])}>{text} <ArrowDownIcon className={styles['button-next-icon']} /></Button>
}

export default NextButton;
