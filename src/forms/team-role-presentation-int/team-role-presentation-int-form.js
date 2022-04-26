import classNames from 'classnames';
import PhotoSlideshow from 'components/PhotoSlideshow/PhotoSlideshow';
import { useState, useEffect } from 'react';
import { isImage } from 'libs/helper';
import Link from 'next/link';

import styles from './team-role-presentation-int-form.module.scss';

const TeamRolePresentationForm = ({ className, stage, project }) => {
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const values = project.config[stage.id];

    setImages(values.files.filter(f => isImage(f.name)).map(i => i.url))
    setDocuments(values.files.filter(f => !isImage(f.name)))
  }, [stage, project])

  return <div className={styles['team-role-presentation-int-form']}>
    <h2 className={styles['team-role-presentation-int-form-title']}>Team role presentation</h2>

    {
      images.length ?
      <PhotoSlideshow className={styles['team-role-presentation-int-form-slideshow']} images={images} /> :
      null
    }
    {documents.length ?
    <div className={styles['team-role-presentation-int-form-docs']}>
      <h3 className={styles['team-role-presentation-int-form-docs-title']}>Other documents</h3>

      <ul className={styles['team-role-presentation-int-form-docs-list']}>
        {documents.map(doc => (
          <li className={styles['team-role-presentation-int-form-docs-list-file']}>
            <Link href={doc.url}>
              <a className={styles['team-role-presentation-int-form-docs-list-file-link']}>
              {doc.name}
              </a>
            </Link>
          </li>))}
      </ul>
    </div> : null}
  </div>
}

export default TeamRolePresentationForm;
