import classNames from 'classnames';

import styles from './IconicLabel.module.scss';

const IconicLabel = ({ Icon, className, children }) => {
  return <div className={classNames(styles['iconic-label'], className)}>
      {Icon ? <Icon className={styles['iconic-label-icon']} /> : null}
      <span className={styles['iconic-label-text']}>{children}</span>
  </div>
}

export default IconicLabel;
