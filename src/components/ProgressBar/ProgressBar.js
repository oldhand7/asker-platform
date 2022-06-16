import classNames from 'classnames';

import styles from './ProgressBar.module.scss';

const ProgressBar = ({ p = 60, className, color = 'blue' }) => (
  <div className={classNames(styles['progress-bar'], className)}>
    <div className={styles['progress-bar-inner']} style={{ width: `${p}%`, color }}></div>
  </div>
)

export default ProgressBar;
