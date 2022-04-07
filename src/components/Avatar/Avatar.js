import classNames from 'classnames';
import placeholder from './assets/images/placeholder.png';

import styles from './Avatar.module.scss';

const Avatar = ({ onClick, className, src, rounded = true }) => {
  const getClassNames = () => {
    return classNames(
      styles['avatar'],
      className,
      rounded ? styles['avatar-rounder'] : ''
    )
  }

  return <div onClick={onClick} className={getClassNames()}>
    <img className={styles['avatar-image']} src={src ? src : placeholder.src} alt="" />
  </div>
}

export default Avatar;
