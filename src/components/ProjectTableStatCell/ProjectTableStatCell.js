import classNames from 'classnames';
import { useState, useEffect } from 'react';
import StatusLabel from 'components/Label/StatusLabel';

import styles from './ProjectTableStatCell.module.scss';

import demoProjects from 'data/demo/projects.json';

const ProjectTableStatCell = ({ project = demoProjects[0], className }) => {
  const [awaiting, setAwaiting] = useState([])
  const [completed, setCompleted] = useState([])
  const [candidates, setCandidates] = useState(project.candidates || []);

  useEffect(() => {
    setAwaiting([
      ...candidates.filter(c => c.status == 'awaiting')
    ])

    setCompleted([
      ...candidates.filter(c => c.status == 'completed')
    ])
  }, [candidates])

  return <div className={classNames(styles['project-table-stat-cell'], className)}>
    <div>
      <span className={styles['project-table-stat-cell-count']}>{candidates.length }</span>
       Number of Candidates
    </div>
    <div className={styles['project-table-stat-cell-status']}>
      <span className={styles['project-table-stat-cell-count']}>{awaiting.length}</span>
      <StatusLabel className={styles['project-table-stat-cell-status-label']}>Awaiting</StatusLabel>
    </div>
    <div className={classNames(
      styles['project-table-stat-cell-status'],
      styles['project-table-stat-cell-status-green']
    )}>
      <span className={styles['project-table-stat-cell-count']}>{completed.length}</span>
      <StatusLabel on={true} className={styles['project-table-stat-cell-status-label']}>Completed</StatusLabel>
    </div>
  </div>
}

export default ProjectTableStatCell;
