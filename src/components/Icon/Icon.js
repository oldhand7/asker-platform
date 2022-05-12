import classNames from 'classnames';

import styles from './Icon.module.scss';

const Icon = ({ icon, className }) => {
  if (icon.src) {
    return <img alt="" className={classNames(styles['icon'], className)} src={icon.src} />
  }

  return <div className={classNames(styles['icon'], className)}>{icon}</div>;
}
export default Icon;
