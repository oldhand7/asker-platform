import classNames from 'classnames';
import StatusLabel from 'components/Label/StatusLabel';

import styles from './ProjectTableStatCell.module.scss';

const ProjectTableStatCell = ({ project, className }) => {
  return <div className={classNames(styles['project-table-stat-cell'], className)}>
    <div>
      <span className={styles['project-table-stat-cell-count']}>{project.interviewsCount} </span>
       Number of candidates
    </div>
    <div className={styles['project-table-stat-cell-status']}>
      <span className={styles['project-table-stat-cell-count']}>{project.interviewsAwaitingCount} </span>
      <StatusLabel className={styles['project-table-stat-cell-status-label']}>Awaiting</StatusLabel>
    </div>
    <div className={classNames(
      styles['project-table-stat-cell-status'],
      styles['project-table-stat-cell-status-green']
    )}>
      <span className={styles['project-table-stat-cell-count']}>{project.interviewsCount - project.interviewsAwaitingCount} </span>
      <StatusLabel on={true} className={styles['project-table-stat-cell-status-label']}>Completed</StatusLabel>
    </div>
  </div>
}

export default ProjectTableStatCell;
