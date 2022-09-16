import classNames from 'classnames';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import { useTranslation } from 'libs/translation';

import styles from './summary-int-form.module.scss';

const SummaryIntForm = ({ className, config }) => {
  const { t, i18nField } = useTranslation()

  return <div className={classNames(styles['summary-int-form'], className)}>
  <h2 className={styles['summary-int-form-title']}>{t('stages.summary.name')}</h2>

  <div className={classNames(
    styles['summary-int-form-text'],
    'format'
  )} dangerouslySetInnerHTML={{
    __html: config && striptags(i18nField(config.html), allowedHtmlTags)}}></div>
</div>
}

export default SummaryIntForm;
