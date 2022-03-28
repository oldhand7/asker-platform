import classNames from 'classnames';
import Button from 'components/Button/Button';

import styles from './hero-section.module.scss';

const HeroSection = ({ className, section }) => {
  return <div style={{ backgroundImage: `url(${section && section.images.length && section.images[0].src})`}} className={classNames(styles['hero-section'], className)}>
    <div className={styles['hero-section-inner']}>
      <h1 className={styles['hero-section-title']} dangerouslySetInnerHTML={{__html: section && section.title.en }}></h1>

      <div className={styles['hero-section-summary']} dangerouslySetInnerHTML={{__html: section && section.content.en}}></div>

      {
        section && section.cta ?
        <p>
           <Button href={section && section.cta.link} className={styles['hero-section-cta']}>{section && section.cta.text.en}</Button>
        </p> : null
      }
    </div>
  </div>
}

export default HeroSection;
