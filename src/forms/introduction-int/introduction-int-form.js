import classNames from 'classnames';
import NextButton from 'components/Button/NextButton';
import { handleNext } from 'libs/helper';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import styles from './introduction-int-form.module.scss';

const IntroductionIntForm = ({ last, nextId, className, stage, project, config }) => {
  return <div className={classNames(styles['introduction-int-form'], className)}>
    <h2 className={styles['introduction-int-form-title']}>Introduction</h2>
    <div className={classNames(
      styles['introduction-int-form-text'],
      'format'
    )} dangerouslySetInnerHTML={{
      __html: config && striptags(config.html || config.text, allowedHtmlTags)}}></div>

    {
    !last ?
    <NextButton
      onClick={() => handleNext(nextId)}
      className={styles['introduction-int-form-question-next']} /> : null}
  </div>
}

export default IntroductionIntForm;
