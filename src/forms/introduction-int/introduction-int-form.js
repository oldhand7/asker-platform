import classNames from 'classnames';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import styles from './introduction-int-form.module.scss';


const IntroductionIntForm = ({ className, config }) => {
  return <div className={classNames(styles['introduction-int-form'], className)}>
    <h2 className={styles['introduction-int-form-title']}>Introduction </h2>

    <div className={classNames(
      styles['introduction-int-form-text'],
      'format'
    )} dangerouslySetInnerHTML={{
      __html: config && striptags(config.html || config.text, allowedHtmlTags)}}></div>
  </div>
}

export default IntroductionIntForm;
