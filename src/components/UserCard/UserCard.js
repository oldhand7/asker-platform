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

  return <div data-test-id="user-card" className={getClassNames()} onClick={onClick}>
    <Avatar src={avatar} className={styles['user-card-avatar']} />
    <span className={styles['user-card-title']}>
      {title}
    </span>
  </div>
}

export default UserCard;
