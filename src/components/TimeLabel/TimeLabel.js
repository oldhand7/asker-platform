import classNames from 'classnames';
import ClockIcon from 'components/Icon/ClockIcon';

import styles from './TimeLabel.module.scss';

const TimeLabel = ({ className, children }) => {
  return <div className={classNames(styles['time-label'], className)}>
      <span className={styles['time-label-label']}>Total Time:</span>
      <ClockIcon className={styles['time-label-icon']} />
      <span className={styles['time-label-value']}>{children}</span>
  </div>
}

export default TimeLabel;
