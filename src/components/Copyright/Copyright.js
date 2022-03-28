import classNames from 'classnames';

import styles from './Copyright.module.scss';

const Copyright = ({ className }) => {
  return <div className={classNames(styles['copyright'], className)}>
    Copyright@Asker.{(new Date()).getFullYear()}
  </div>
}

export default Copyright
