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

const Navbar = ({ className, menu = [] }) => {
  const [config, t] = useSite();
  const [mode, setMode] = useState('normal');
  const [user] = useUser();
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

  const [menuActive, setMenuActive] = useState(false);

  useEffect(() => {
    if (menuActive) {
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflowX = 'auto';
    }
  }, [menuActive])

  const handleMobileToggle = () => {
    setMenuActive(!menuActive)
  }

  const getClassNames = () => {
    return classNames(
      styles['navbar'],
      className,
      menuActive ? styles['mobile'] : '',
      styles[`navbar-${mode}`]
    )
  }

  return <div id="navbar" className={getClassNames()}>
    <div className={styles['navbar-inner']}>
    <Logo darkMode={mode == 'fixed'} onClick={() => setMenuActive(false)} className={styles['navbar-logo']} />
    <Menu items={menuItems} onClick={() => setMenuActive(false)} className={styles['navbar-menu']} />
    {
        user ? <UserMenu className={styles['navbar-session']} /> :
        <>
          <MenuToggle className={styles['navbar-open']} onClick={handleMobileToggle} active={false} />
          <div className={styles['navbar-session-login']}><Link href="/login">Login</Link></div>
          <div className={styles['navbar-mobile']}>
            <Logo onClick={() => setMenuActive(false)} className={styles['navbar-logo']} />
            <Menu items={[
              {
                id: 'login',
                title: 'Login',
                href: '/login'
              }
            ]} onClick={() => setMenuActive(false)} className={styles['navbar-menu']} />
            <MenuToggle className={styles['navbar-close']} onClick={handleMobileToggle} active={true} />
          </div>
        </>
      }
      </div>
  </div>
}

export default Navbar;
