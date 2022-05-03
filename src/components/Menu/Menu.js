import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './Menu.module.scss';

const Menu = ({ className, onClick, items = [] }) => {
  const router = useRouter();

  return <ul className={classNames(styles['menu'], className)}>
    {items.map((menuItem, index) => {
      return <li onClick={onClick} key={menuItem.id} className={classNames(styles['menu-item'], router.asPath.indexOf(menuItem.href) == 0 ? styles['active'] : '')}>
            <Link href={menuItem.href}><a className={styles['menu-link']}>{menuItem.title}</a></Link>
          </li>
    })}
  </ul>
}

export default Menu;
