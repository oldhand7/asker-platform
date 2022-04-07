/* eslint-disable @next/next/no-html-link-for-pages */
import SocialMenu from 'components/SocialMenu/SocialMenu';
import ContactMenu from 'components/ContactMenu/ContactMenu';
import Logo from 'components/Logo/Logo';
import Copyright from 'components/Copyright/Copyright';
import Link from 'next/link';
import { useSite } from 'libs/site';

import styles from './Footer.module.scss';

const Footer = () => {
  const [config, t] = useSite();

  return <><div className={styles['footer']}>
    <div className={styles['footer-inner']}>
      <div className={styles['footer-company']}>
        <Logo className={styles['footer-company-logo']} darkMode={true} />
        <p className={styles['footer-company-text']}>{config && config['company-about']}</p>
        <div className={styles['footer-company-social']}>
          <h3 className={styles['footer-company-social-title']}>{t('Social')}</h3>
          <SocialMenu links={{
            facebook: config && config['company-facebook'],
            linkedin: config && config['company-linkedin']
          }}/>
        </div>
      </div>
      <div className={styles['footer-contact-widget']}>
        <h3 className={styles['footer-contact-widget-title']}>{t('Contact')}</h3>
        <ContactMenu email={config && config['company-email']} address={config && config['company-address']} />
      </div>
      <div className={styles['footer-footer']}>
          <div className={styles['footer-links']}>
            {/*<a href="/terms">{t('Terms and conditions')}</a>*/}
            <Link href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}cookie-policy`}>
              <a target="_blank" >{t('Cookie policy')}</a>
            </Link>
          </div>
          <Copyright className={styles['footer-copyright']} />
      </div>
    </div>
  </div>
  </>
}

export default Footer;
