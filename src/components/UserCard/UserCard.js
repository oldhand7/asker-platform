import classNames from 'classnames';
import Avatar from 'components/Avatar/Avatar';

import styles from './UserCard.module.scss';

const UserCard = ({ title = '', avatar = '', className, onClick }) => {
  const getClassNames = () => {
    return classNames(
      styles['user-card'],
      className
    )
  }

  return <div className={getClassNames()} onClick={onClick}>
    {avatar ? <Avatar src={avatar} className={styles['user-card-avatar']} /> : null}
    <span className={styles['user-card-title']}>
      {title}
    </span>
  </div>
}

export default UserCard;
