import classNames from 'classnames';
import GetInTouchButton from 'components/Button/GetInTouchButton';
import UpsellImage from './assets/images/image 15.jpg';
import styles from './mission-section.module.scss';
import { useSite } from 'libs/site';

const MissionSection = ({ section, className }) => {
  const [config, t] = useSite();
  
  return <div className={classNames(styles['mission-section'], className)}>
    <div className={styles['mission-section-inner']}>
      <h2 className={styles['mission-section-title']}>{section && section.title.en}</h2>

      <div className={classNames(styles['mission-section-body'], 'format')} dangerouslySetInnerHTML={{ __html: section && section.content.en }}></div>

      <div>
        <p>
          <GetInTouchButton text={t('Get in touch')}  className={styles['mission-section-cta']} href='/contact' />
        </p>

        <p>
          <img src={UpsellImage.src} className={styles['mission-section-upsell-image']} />
        </p>
      </div>
    </div>
  </div>
}

export default MissionSection;
