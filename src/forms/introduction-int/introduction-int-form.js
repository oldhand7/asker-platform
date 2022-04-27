import classNames from 'classnames';

import styles from './introduction-int-form.module.scss';

const IntroductionIntForm = ({ className, stage, project, config }) => {
  return <div className={classNames(styles['introduction-int-form'], className)}>
    <h2 className={styles['introduction-int-form-title']}>Introduction</h2>
    <div className={classNames(
      styles['introduction-int-form-text'],
      'format'
    )}>{config.text}</div>
  </div>
}

export default IntroductionIntForm;
