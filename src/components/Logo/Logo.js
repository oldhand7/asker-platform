import classNames from 'classnames';
import Link from 'next/link';
import Askerlogo from './assets/images/ASKER_Logga.png';
import AskerlogoInv from './assets/images/ASKER_Logga_Inv.png';

import styles from './Logo.module.scss';

const Logo = ({ className, onClick, darkMode = false }) => {
  return <Link href="/"><a onClick={onClick} className={classNames(styles['logo'], className)}>
    {
      !darkMode ?
      <img className={styles['logo-image']} src={Askerlogo.src} alt="ASKER" /> :
      <img className={styles['logo-image']} src={AskerlogoInv.src} alt="ASKER" />
    }
  </a></Link>
}

export default Logo;
