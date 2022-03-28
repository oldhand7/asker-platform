import Button from 'components/Button/Button';
import Menu from 'components/Menu/Menu';
import Logo from 'components/Logo/Logo';
import classNames from 'classnames';
import { useState } from 'react';
import MenuToggle from 'components/MenuToggle/MenuToggle';
import { useSite } from 'libs/site';
import { page2menu } from 'libs/helper';

import styles from './Navbar.module.scss';

const Navbar = ({ className, menu = [] }) => {
  const [config, t] = useSite();

  const [menuActive, setMenuActive] = useState(false);

  const handleMobileToggle = () => {
    setMenuActive(!menuActive)
  }

  return <div className={classNames(styles['navbar'], className, menuActive ? styles['mobile'] : '')}>
    <div className={styles['navbar-inner']}>
      <Logo onClick={() => setMenuActive(false)} className={styles['navbar-logo']} />
      <Menu items={config && config['menu'] ? config['menu'].map(p => page2menu(p)) : []} onClick={() => setMenuActive(false)} className={styles['navbar-menu']} />
      <MenuToggle className={styles['navbar-toggle']} onClick={handleMobileToggle} active={menuActive} />
      <div onClick={() => setMenuActive(false)} className={styles['navbar-session']}>
        {/*  <Button href={`/login`}>Log in</Button>*/}
      </div>
    </div>
  </div>
}

export default Navbar;
