import classNames from 'classnames';
import PhotoSlideshow from 'components/PhotoSlideshow/PhotoSlideshow';
import { useState, useEffect } from 'react';
import { isImage} from 'libs/helper';
import Link from 'next/link';
import striptags from 'striptags';
import { allowedHtmlTags } from 'libs/config';
import { useTranslation } from 'libs/translation';

import styles from './company-presentation-int-form.module.scss';

const CompanyPresentationForm = ({ className, stage, project, config }) => {
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const values = stage.config;

    setImages(values.files.filter(f => isImage(f.name)).map(i => i.url))
    setDocuments(values.files.filter(f => !isImage(f.name)))
  }, [stage, project])

  return <div className={classNames(styles['company-presentation-int-form'], className)}>
    <h2 className={styles['company-presentation-int-form-title']}>{t('stages.company-presentation.name')}</h2>

    <div className={classNames(
      styles['company-presentation-int-form-text'],
      'format'
    )} dangerouslySetInnerHTML={{
      __html: config && striptags(config.notes, allowedHtmlTags)}}></div>

    {
      images.length ?
      <PhotoSlideshow className={styles['company-presentation-int-form-slideshow']} images={images} /> :
      null
    }
    {documents.length ?
    <div className={styles['company-presentation-int-form-docs']}>
      <h3 className={styles['company-presentation-int-form-docs-title']}>{t('labels.other-documents')}</h3>

      <ul className={styles['company-presentation-int-form-docs-list']}>
        {documents.map(doc => (
          <li className={styles['company-presentation-int-form-docs-list-file']}>
            <Link href={doc.url}>
              <a target="_blank" className={styles['company-presentation-int-form-docs-list-file-link']}>
              {doc.name}
              </a>
            </Link>
          </li>))}
      </ul>
    </div> : null}
  </div>
}

export default CompanyPresentationForm;
