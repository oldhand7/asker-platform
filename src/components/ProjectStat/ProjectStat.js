import classNames from 'classnames';
import StatusLabel from 'components/Label/StatusLabel';
import ClockIcon from 'components/Icon/ClockIcon';
import { getTimeLabel } from 'libs/helper';
import { useTranslation } from 'libs/translation';

import styles from './ProjectStat.module.scss';

const ProjectStat = ({ project, className, template = false}) => {
  const { t } = useTranslation();

  return <div className={classNames(styles['project-stat'], className)}>
    <div className={classNames(
      styles['project-stat-cell'],
      styles['project-stat-time']
    )}>
      <ClockIcon className={styles['project-stat-time-icon']} />
      <span className={styles['project-stat-time-value']}>{getTimeLabel(project.time || 0)}</span>
    </div>

    {!template ? <>
    <div className={classNames(
      styles['project-stat-cell'],
      styles['project-stat-status'],
      styles['project-stat-status-complete']
    )}>
      <span className={styles['project-stat-status-value']}>{project.interviewCount - project.interviewAwaitingCount || 0} </span>
      <StatusLabel on={true} className={styles['project-stat-status-label']}>{t('status.completed')}</StatusLabel>
    </div>

    <div className={classNames(
        styles['project-stat-cell'],
        styles['project-stat-status'],
        styles['project-stat-status-awaiting']
    )}>
      <span className={styles['project-stat-status-value']}>{project.interviewAwaitingCount || 0} </span>
      <StatusLabel className={styles['project-stat-status-label']}>{t('status.awaiting')}</StatusLabel>
    </div></> : null}
  </div>
}

export default ProjectStat;
