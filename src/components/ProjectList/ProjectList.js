import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectStat from 'components/ProjectStat/ProjectStat';
import { useRouter } from 'next/router';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import { useUser } from 'libs/user';
import { useTranslation } from 'libs/translation';

import styles from './ProjectList.module.scss';

const ProjectList = ({ className, data = [], onDelete, saveAsTemplate, emptyText = 'No data', ...props }) => {
  const router = useRouter()
  const { user } = useUser();
  const { t } = useTranslation();

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'edit') {
      router.push(`/projects/${row.id}/edit/`)
    }

    if (c.id == 'overview') {
      router.push(`/projects/${row.id}/overview/`)
    }

    if (c.id == 'delete') {
      onDelete && onDelete(row)
    }

    if (c.id == 'save-as-template') {
      saveAsTemplate && saveAsTemplate(row)
    }
  }


   return <ul data-test-id="project-list" className={classNames(
    styles['project-list'],
    className
   )}>
    {data.map(item => {
      const options = [
        { id: 'overview', name: t('labels.interviews') },
        { id: 'edit', name: t('actions.edit') },
        { id: 'save-as-template', name: t('actions.save.as-template') }
      ]

      if (user && user.companyId == item.companyId) {
        options.push({
          id: 'delete',
          name: t('actions.delete')
        })
      }

      return <li onClick={() => router.push(`/projects/${item.id}/overview/`)} key={item.id} className={styles['project-list-item']}>
        <div className={styles['project-list-item-column']}>
          {item.template && item.template.name ?
          <div className={styles['project-list-info']}>
            <span className={styles['project-list-info-name']}>{t('headings.template-name')}</span>
            <span className={styles['project-list-info-value']}>{item.template.name}</span>
          </div> : null}

          <div className={styles['project-list-info']}>
            <span className={styles['project-list-info-name']}>{t('labels.interviewer')}</span>
            <span className={styles['project-list-info-value']}></span>
            <ul className={styles['project-list-interviewer-list']}>
              {item.interviewers && item.interviewers.map(i => <li key={i.id} className={styles['project-list-interviewer-list-item']}>{i.name}</li>)}
            </ul>
          </div>
        </div>
        <div className={classNames(
          styles['project-list-item-column'],
          styles['project-list-details']
        )}>
            <div className={styles['project-list-details-head']}>
              <h2 className={styles['project-list-item-title']}>{item.name}</h2>
              <ProjectStat className={styles['project-list-stats']} project={item} />
            </div>
            <div className={styles['project-list-details-body']}>
              <Stager className={styles['project-list-stager']} stages={item.stages} />
            </div>
          <CompactMenu className={styles['project-list-item-control']} options={options} onChoice={c => handleCompactMenuChoice(c, item)} />
        </div>
      </li>
    })}
    {!data.length ? <li>{emptyText}</li> : null}
   </ul>
}

export default ProjectList;
