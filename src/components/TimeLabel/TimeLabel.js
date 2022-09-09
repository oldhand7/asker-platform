import classNames from 'classnames';
import ClockIcon from 'components/Icon/ClockIcon';
import { useTranslation } from 'libs/translation';
import { getTimeLabel } from 'libs/helper'

import styles from './TimeLabel.module.scss';

const TimeLabel = ({ className, label = '', time, children }) => {
  const { t } = useTranslation();

  return <div className={classNames(styles['time-label'], className)}>
      <span className={styles['time-label-label']}>{label || `${t('labels.total-time')}:`}</span>
      <ClockIcon className={styles['time-label-icon']} />
      <span className={styles['time-label-value']}>{typeof time === "undefined" ? children : getTimeLabel(time)}</span>
  </div>
}

export default TimeLabel;
