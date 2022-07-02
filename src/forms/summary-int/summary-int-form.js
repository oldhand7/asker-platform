import classNames from 'classnames';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';

import styles from './summary-int-form.module.scss';

const SummaryIntForm = ({ className, stage, project, config, last, nextId }) => {
  return <div className={classNames(styles['summary-int-form'], className)}>
    <h2 className={styles['summary-int-form-title']}>Summary</h2>
    <div className={classNames(
      styles['summary-int-form-text'],
      'format'
    )} dangerouslySetInnerHTML={{
      __html: config && striptags(config.html || config.text, allowedHtmlTags)}}></div>
  </div>
}

export default SummaryIntForm;
