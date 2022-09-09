import classNames from 'classnames';
import ClockIcon from 'components/Icon/ClockIcon';

import styles from './StageTime.module.scss';

const StageTime = ({ className, time, unit = 'min', children }) => {
  return <div className={classNames(styles['stage-time'], className)}>
    <ClockIcon className={styles['stage-time-icon']} />
    <span className={styles['stage-time-value']}>{children || `${time} ${unit}`}</span>
  </div>
}

export default StageTime;
