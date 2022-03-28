import classNames from 'classnames';
import ContactForm from 'forms/contact/contact-form';
import striptags from 'striptags';
import { useSite } from 'libs/site';

import styles from './contact-section.module.scss';

const ContactSection = ({ className, section }) => {
  const [config, t] = useSite();

  return <div id="section-contact" className={classNames(styles['contact-section'], className)}>
    <div className={styles['contact-section-inner']}>
      <h2 className={styles['contact-section-title']}>{t('Contact us')}</h2>
      <ContactForm className={styles['contact-section-form']} />
      <div className={styles['contact-section-info']}>
        <h3 className={styles['contact-section-info-title']} dangerouslySetInnerHTML={{ __html: section && section.title.en}}></h3>
        <div>{striptags(section && section.content.en)}</div>
      </div>
    </div>
  </div>
}

export default ContactSection;
