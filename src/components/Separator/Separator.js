import classNames from 'classnames';

import styles from './Separator.module.scss';

const Separator = ({ className, text = 'Or' }) => {
  return <div className={classNames(styles['separator'], className)}><span className={styles['separator-text']}>{text}</span></div>
}

export default Separator;
