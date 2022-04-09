import classNames from 'classnames';

import styles from './Label.module.scss';

const Label = ({ className, children }) => {
  return <span className={classNames(styles['label'], className)}>{children}</span>
}

export default Label;
