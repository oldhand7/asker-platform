import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useUser, logout } from 'libs/user';
import UserCard from 'components/UserCard/UserCard';
import Link from 'next/link';
import CarretDown from 'components/Icon/CarretDown';

import styles from './UserMenu.module.scss';

const UserMenu = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [user] = useUser();
  const menuRef = useRef();

  const getClassNames = () => {
    return classNames(
      styles['usermenu'],
      open ? styles['usermenu-open'] : '',
      className
    )
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOffClick = ev => {
      if (ev.target != menuRef.current && !menuRef.current.contains(ev.target)) {
        setOpen(false)
      }
    }

    document.body.addEventListener('click', handleOffClick)

    return () => {
      document.body.removeEventListener('click', handleOffClick)
    }
  }, [open])


  return <div ref={menuRef} onClick={() => setOpen(!open)} className={getClassNames()}>
    <div className={styles['usermenu-head']}>
      <UserCard avatar={user && user.profile.photoURL} title={user && user.profile.displayName} className={styles['usermenu-head-card']}  />
      <CarretDown className={styles['usermenu-head-carret']} />
    </div>
    <ul className={styles['usermenu-submenu']}>
      <li><Link href="/profile"><a>Profile</a></Link></li>
      <li><Link href="/logout"><a>Logout</a></Link></li>
    </ul>
  </div>
}

export default UserMenu;
