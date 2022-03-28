import classNames from 'classnames';
import ContactForm from 'forms/contact/contact-form';
import TeamCarousel from 'components/TeamCarousel/TeamCarousel';
import GetInTouchButton from 'components/Button/GetInTouchButton';
import { employee2team } from 'libs/helper';
import { useSite } from 'libs/site';

import styles from './team-section.module.scss';

const TeamSection = ({ className, employees = [], section  }) => {
  const [config, t] = useSite();

  return <div className={classNames(styles['team-section'], className)}>
    <div className={styles['team-section-inner']}>
      <h2 className={styles['team-section-title']}>{section && section.title.en}</h2>

      <div className={classNames(styles['team-section-body'], 'format')} dangerouslySetInnerHTML={{__html: section && section.content.en}}></div>

      <div>
        <GetInTouchButton text={t('Get in touch')} className={styles['team-section-cta']} href='/contact' />
      </div>

      <TeamCarousel team={employees.map(employee2team)} className={styles['team-section-carousel']} />
    </div>
  </div>
}

export default TeamSection;
