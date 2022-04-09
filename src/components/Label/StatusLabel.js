import Label from './Label';
import classNames from 'classnames'

import styles from './StatusLabel.module.scss';

const StatusLabel = ({ on = false, className, children }) => {

  return <Label className={classNames(
    styles['status-label'],
    className,
    on ? styles['status-label-on'] : ''
  )}>{children}</Label>
}

export default StatusLabel;
