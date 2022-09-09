import Menu from 'components/Menu/Menu';
import Logo from 'components/Logo/Logo';
import classNames from 'classnames';
import { useState, useEffect, useMemo } from 'react';
import MenuToggle from 'components/MenuToggle/MenuToggle';
import { useSite } from 'libs/site';
import { useUser } from 'libs/user';
import dynamic from 'next/dynamic';
import LanguageSwitcher from 'components/LanguageSwitcher/LanguageSwitcher';

import styles from './Navbar.module.scss';

const NavbarUserResolved = dynamic(() => import("components/NavbarUserResolved/NavbarUserResolved"), { ssr: false })

const menuItemsMobile = ({ user, t, menuItems = []}) => {
  const mobile = [...menuItems]

  if (user) {
    mobile.push({
      id: 'profile',
      title: t('Profile'),
      href: '/profile/'
    })

    mobile.push({
      id: 'logout',
      title: t('Logout'),
      href: '/logout/'
    })
  }

  return mobile
}

const Navbar = ({ className, menu = [] }) => {
  const {config, t} = useSite();
  const [mode, setMode] = useState('normal');
  const { user, loading } = useUser();
  const [open, setOpen] = useState(false);
  const [menuItemsLoad, setMenuItemsLoad] = useState([]);

  const menuItems = useMemo(() => [
    {
      id: 'projects',
      title: t('Projects'),
      href: '/projects/'
    },
    {
      id: 'templates',
      title: t('Templates'),
      href: '/templates/'
    },
    {
      id: 'questions',
      title: t('Questions'),
      href: '/questions/'
    }
  ], [t])

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
    if (!user) {
      return;
    }

    setMenuItemsLoad(menuItems)
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
        <Menu items={menuItemsMobile({ user, t, menuItems })} onClick={() => setOpen(false)} className={styles['navbar-menu']} />
      }

      <div className={styles['navbar-control']}>
        <LanguageSwitcher className={styles['navbar-language-switcher']} />
        {user ? <NavbarUserResolved user={user} loading={loading} className={styles['navbar-session']} styles={styles} /> : null}
      </div>

      <MenuToggle className={styles['navbar-toggle']} onClick={handleMobileToggle} active={open} />
    </div>
  </div>
}

export default Navbar;
