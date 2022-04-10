import classNames from 'classnames';
import TrashIcon from 'components/Icon/TrashIcon';
import UpDownIcon from 'components/Icon/UpDownIcon';

import styles from './ProjectFormStager.module.scss';

const ProjectFormStager = ({ className, stages = [], onStageSelect }) => {

  const handleDelete = stage => {
    if (!stage) {
      return;
    }

    alert('Deleting...')
  }

  const handleStageNav = (dir, stage) => {
    alert('Moving stage ' + dir)
  }

  return <ul className={classNames(styles['project-form-stager'], className)}>
    {stages.map((stage, index) => {
      return <li key={stage ? stage.id : `nullstage-${index}`} onClick={() => onStageSelect(stage)} className={classNames(styles['project-form-stager-item'], !stage ? styles['project-form-stager-item-empty'] : '')}>
        <h6 className={styles['project-form-stager-item-title']}>Stage {index + 1}</h6>

        <div className={styles['project-form-stager-item-body']}>
          <div className={styles['project-form-stager-stage']}>
            <span className={styles['project-form-stager-stage-name']}>{stage ? stage.name : 'Drag and drop here to add a section'}</span>
            <UpDownIcon className={styles['project-form-stager-stage-nav']} />
          </div>
          <div className={styles['project-form-stager-item-control']}>
            <button type="button" onClick={() => handleDelete(stage)} className={styles['project-form-stager-item-control-button']}>
              <TrashIcon className={styles['project-form-stager-item-control-button-icon']} />
            </button>
          </div>
        </div>
      </li>
    })}
  </ul>
}

export default ProjectFormStager;
