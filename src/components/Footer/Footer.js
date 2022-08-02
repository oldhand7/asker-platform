/* eslint-disable @next/next/no-html-link-for-pages */
import SocialMenu from 'components/SocialMenu/SocialMenu';
import ContactMenu from 'components/ContactMenu/ContactMenu';
import Logo from 'components/Logo/Logo';
import Copyright from 'components/Copyright/Copyright';
import { useSite } from 'libs/site';
import ContactModal from 'modals/contact/contact-modal';
import MessageUsButton from 'components/MessageUsButton/MessageUsButton';
import { useModal } from 'libs/modal';
import CallUsButton from 'components/CallUsButton/CallUsButton';

import styles from './Footer.module.scss';

const Footer = () => {
  const [config, t] = useSite();
  const openContactModal = useModal(ContactModal);

  return <><div className={styles['footer']}>
    <div className={styles['footer-inner']}>
      <div className={styles['footer-company']}>
        <Logo className={styles['footer-company-logo']} darkMode={false} />
        <p className={styles['footer-company-text']}>{config && config['company-about']}</p>
      </div>
      <div className={styles['footer-contact-widget']}>
        <h3 className={styles['footer-contact-widget-title']}>Contact</h3>
        <ContactMenu email={config && config['company-email']} address={config && config['company-address']} />
      </div>

      <div className={styles['footer-footer']}>
          <Copyright className={styles['footer-copyright']} />

          <div className={styles['footer-links']}>
            <a href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}terms`}>Terms and conditions</a>
            <a href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}cookie-policy`}>Cookie policy</a>
          </div>

          <SocialMenu links={{
            facebook: config && config['company-facebook'],
            linkedin: config && config['company-linkedin'],
            instagram: config && config['company-instagram']
          }}/>
      </div>
    </div>
  </div>
  </>
}

export default Footer;
