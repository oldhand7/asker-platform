import classNames from 'classnames';
import MapPinIcon from './assets/icons/map-pin.svg';
import Icon from 'components/Icon/Icon';
import MailIcon from 'components/Icon/MailIcon';

import styles from './ContactMenu.module.scss';

const ContactMenu = ({ className, email = '', address = '' }) => {
  return <ul className={classNames(styles['contact-menu'], className)}>
    <li className={styles['contact-menu-item']}>
      <MailIcon className={styles['contact-menu-icon']} />
      <a href={`mailto:${email}`} className={styles['contact-menu-link']}>{email}</a>
    </li>

    <li className={styles['contact-menu-item']}>
      <Icon className={styles['contact-menu-icon']} icon={<MapPinIcon />} />
      <a target="_blank" rel="noreferrer"  href={`https://www.google.com/maps/?q=${address}`} className={styles['contact-menu-link']}>
        {address}
      </a>
    </li>
  </ul>
}

export default ContactMenu;
