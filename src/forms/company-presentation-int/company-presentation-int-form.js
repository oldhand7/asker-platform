import classNames from 'classnames';
import PhotoSlideshow from 'components/PhotoSlideshow/PhotoSlideshow';
import { useState, useEffect } from 'react';
import { isImage, handleNext} from 'libs/helper';
import Link from 'next/link';
import NextButton from 'components/Button/NextButton';

import styles from './company-presentation-int-form.module.scss';

const CompanyPresentationForm = ({ className, stage, project, last, nextId }) => {
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const values = project.config[stage.id];

    setImages(values.files.filter(f => isImage(f.name)).map(i => i.url))
    setDocuments(values.files.filter(f => !isImage(f.name)))
  }, [stage, project])

  return <div className={styles['company-presentation-int-form']}>
    <h2 className={styles['company-presentation-int-form-title']}>Company presentation</h2>

    {
      images.length ?
      <PhotoSlideshow className={styles['company-presentation-int-form-slideshow']} images={images} /> :
      null
    }
    {documents.length ?
    <div className={styles['company-presentation-int-form-docs']}>
      <h3 className={styles['company-presentation-int-form-docs-title']}>Other documents</h3>

      <ul className={styles['company-presentation-int-form-docs-list']}>
        {documents.map(doc => (
          <li className={styles['company-presentation-int-form-docs-list-file']}>
            <Link href={doc.url}>
              <a className={styles['company-presentation-int-form-docs-list-file-link']}>
              {doc.name}
              </a>
            </Link>
          </li>))}
      </ul>
    </div> : null}

    {!last ? <NextButton onClick={() => handleNext(nextId)} className={styles['company-presentation-int-form-next-button']} /> : null}
  </div>
}

export default CompanyPresentationForm;
