import Menu from 'components/Menu/Menu';
import Logo from 'components/Logo/Logo';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import MenuToggle from 'components/MenuToggle/MenuToggle';
import { useSite } from 'libs/site';
import { useScrollDirection } from 'react-use-scroll-direction'
import UserMenu from 'components/UserMenu/UserMenu';
import { useUser } from 'libs/user';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import styles from './Navbar.module.scss';

const NavbarUserResolved = dynamic(() => import("components/NavbarUserResolved/NavbarUserResolved"), { ssr: false })

const menuItems = [
  {
    id: 'projects',
    title: 'Projects',
    href: '/projects/'
  },
  {
    id: 'templates',
    title: 'Templates',
    href: '/templates/'
  },
  {
    id: 'questions',
    title: 'Questions',
    href: '/questions/'
  }
]

const menuItemsMobile = (user) => {
  const mobile = [...menuItems]

  if (user) {
    mobile.push({
      id: 'profile',
      title: 'Profile',
      href: '/profile/'
    })

    mobile.push({
      id: 'logout',
      title: 'Logout',
      href: '/logout/'
    })
  }

  return mobile
}

const Navbar = ({ className, menu = [] }) => {
  const [config, t] = useSite();
  const [mode, setMode] = useState('normal');
  const { user, loading } = useUser();
  const [open, setOpen] = useState(false);
  const [menuItemsLoad, setMenuItemsLoad] = useState([]);

  // const {
  //   isScrollingUp,
  //   isScrollingDown,
  //   isScrolling
  // } = useScrollDirection()
  //
  // useEffect(() => {
  //   if (isScrollingUp && window.pageYOffset > 100) {
  //     setMode('fixed')
  //   }
  // }, [isScrollingUp])
  //
  // useEffect(() => {
  //   if (isScrollingDown && window.pageYOffset > 100) {
  //     setMode('offset')
  //   }
  // }, [isScrollingDown])
  //
  // useEffect(() => {
  //   if (window.pageYOffset == 0) {
  //     setMode('normal')
  //   }
  // }, [isScrolling])

  useEffect(() => {
    if (open) {
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflowX = 'auto';
    }
  }, [open])

  const handleMobileToggle = () => {
    setOpen(!open)
  }

  useEffect(() => {
    setMenuItemsLoad(user && menuItems || [])
  }, [user, menuItems])

  return <div id="navbar" className={classNames(
    styles['navbar'],
    className,
    open ? styles['mobile'] : '',
    styles[`navbar-${mode}`]
  )}>
    <div className={styles['navbar-inner']}>
      <Logo darkMode={mode == 'fixed'} onClick={() => setOpen(false)} className={styles['navbar-logo']} />

      {
        !open ?
        <Menu items={menuItemsLoad} onClick={() => setOpen(false)} className={styles['navbar-menu']} /> :
        <Menu items={menuItemsMobile(user)} onClick={() => setOpen(false)} className={styles['navbar-menu']} />
      }

      <NavbarUserResolved user={user} loading={loading} className={styles['navbar-session']} styles={styles} />

      <MenuToggle className={styles['navbar-toggle']} onClick={handleMobileToggle} active={open} />
    </div>
  </div>
}

export default Navbar;
