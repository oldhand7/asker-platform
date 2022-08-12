import classNames from 'classnames';
import Toggle from 'react-toggle'
import Preloader from 'components/Preloader/Preloader';
import { saveCollectionDocument } from 'libs/firestore';
import { useState } from 'react';

import styles from './ProjectAnonimizeToggle.module.scss'

const ProjectAnonimizeToggle = ({ className, project, onChange }) => {
  const [loading, setLoading] = useState(false);

  const toggleAnonimization = () => {
    setLoading(true);

    const anonimizedProject = {
      id: project.id,
      anonimize: !project.anonimize
    }

    saveCollectionDocument('projects', anonimizedProject)
      .then(() => {
        setLoading(false);

        project.anonimize = !project.anonimize;

        onChange(project);
      })
      .catch(() => {
        setError(new Error("Saving project failed."))
        setLoading(false);
      })
  }


  return <div className={classNames(
    styles["project-anonimize-toggle"],
    className
  )}>
    <Toggle
      id='anonimization-status'
      defaultChecked={project.anonimize}
      onChange={toggleAnonimization}
      className={styles["project-anonimize-toggle-input"]}
    />
    <label className={styles["project-anonimize-toggle-label"]} htmlFor='anonimization-status'>Anonimize candidates</label>
    {loading ? <Preloader /> : null}
  </div>
}

export default ProjectAnonimizeToggle;
