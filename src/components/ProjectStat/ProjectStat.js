import classNames from 'classnames';
import StatusLabel from 'components/Label/StatusLabel';
import ClockIcon from 'components/Icon/ClockIcon';

import styles from './ProjectStat.module.scss';

const ProjectStat = ({ project, className, template = false}) => {
  return <div className={classNames(styles['project-stat'], className)}>
    <div className={classNames(
      styles['project-stat-cell'],
      styles['project-stat-time']
    )}>
      <ClockIcon className={styles['project-stat-time-icon']} />
      <span className={styles['project-stat-time-value']}>{project.time || 0} min</span>
    </div>

    {!template ? <>
    <div className={classNames(
      styles['project-stat-cell'],
      styles['project-stat-status'],
      styles['project-stat-status-complete']
    )}>
      <span className={styles['project-stat-status-value']}>{project.interviewCount - project.interviewAwaitingCount || 0} </span>
      <StatusLabel on={true} className={styles['project-stat-status-label']}>Completed</StatusLabel>
    </div>

    <div className={classNames(
        styles['project-stat-cell'],
        styles['project-stat-status'],
        styles['project-stat-status-awaiting']
    )}>
      <span className={styles['project-stat-status-value']}>{project.interviewAwaitingCount || 0} </span>
      <StatusLabel className={styles['project-stat-status-label']}>Awaiting</StatusLabel>
    </div></> : null}
  </div>
}

export default ProjectStat;
