import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from './Menu.module.scss';

const menuItems = [
  {
    href: '/',
    title: 'Home'
  }
]

const Menu = ({ className, onClick, items = [] }) => {
  const router = useRouter();

  return <ul className={classNames(styles['menu'], className)}>
    {items.map((menuItem, index) => {
      return <li onClick={onClick} key={menuItem.id} className={classNames(styles['menu-item'], router.asPath == menuItem.href ? styles['active'] : '')}>
            <Link href={menuItem.href}><a className={styles['menu-link']}>{menuItem.title}</a></Link>
          </li>
    })}
  </ul>
}

export default Menu;
