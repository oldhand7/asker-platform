import Button from 'components/Button/Button';
import Menu from 'components/Menu/Menu';
import Logo from 'components/Logo/Logo';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import MenuToggle from 'components/MenuToggle/MenuToggle';
import { useSite } from 'libs/site';
import { page2menu } from 'libs/helper';
import { useScrollDirection } from 'react-use-scroll-direction'
import UserMenu from 'components/UserMenu/UserMenu';
import { useUser } from 'libs/user';
import Link from 'next/link';

import styles from './Navbar.module.scss';

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

  const {
    isScrollingUp,
    isScrollingDown,
    isScrolling
  } = useScrollDirection()

  useEffect(() => {
    if (isScrollingUp && window.pageYOffset > 100) {
      setMode('fixed')
    }
  }, [isScrollingUp])

  useEffect(() => {
    if (isScrollingDown && window.pageYOffset > 100) {
      setMode('offset')
    }
  }, [isScrollingDown])

  useEffect(() => {
    if (window.pageYOffset == 0) {
      setMode('normal')
    }
  }, [isScrolling])


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
        <Menu items={menuItems} onClick={() => setOpen(false)} className={styles['navbar-menu']} /> :
        <Menu items={menuItemsMobile(user)} onClick={() => setOpen(false)} className={styles['navbar-menu']} />
      }

      {user && !loading ? <UserMenu className={styles['navbar-session']} /> : null}
      {!user && !loading ? <Link href="/login/">
        <a className={styles['navbar-login-link']}>Login</a></Link> : null}
      {!user && loading ? <span></span> : null}

      <MenuToggle className={styles['navbar-toggle']} onClick={handleMobileToggle} active={open} />
    </div>
  </div>
}

export default Navbar;
