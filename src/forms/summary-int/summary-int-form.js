import classNames from 'classnames';

import styles from './summary-int-form.module.scss';

const SummaryIntForm = ({ className, stage, project, config }) => {
  return <div className={classNames(styles['summary-int-form'], className)}>
    <h2 className={styles['summary-int-form-title']}>Summary</h2>
    <div className={classNames(
      styles['summary-int-form-text'],
      'format'
    )}>{config.text}</div>
  </div>
}

export default SummaryIntForm;
