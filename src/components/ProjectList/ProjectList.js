import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectStat from 'components/ProjectStat/ProjectStat';
import { useRouter } from 'next/router';
import CompactMenu from 'components/CompactMenu/CompactMenu';

import styles from './ProjectList.module.scss';
import { useUser } from 'libs/user';

const ProjectList = ({ className, data = [], onDelete, emptyText = 'No data', ...props }) => {
  const router = useRouter()
  const { user } = useUser();

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'edit') {
      router.push(`/projects/${row.id}/edit/`)
    }

    if (c.id == 'overview') {
      router.push(`/projects/${row.id}/overview/`)
    }

    if (c.id == 'delete' && onDelete) {
      onDelete(row)
    }
  }


   return <ul data-test-id="project-list" className={classNames(
    styles['project-list'],
    className
   )}>
    {data.map(item => {
      const options = [
        { id: 'overview', name: 'Interviews' },
        { id: 'edit', name: 'Edit' }
      ]

      if (user && item.companyId == item.companyId) {
        options.push({
          id: 'delete',
          name: 'Delete'
        })
      }

      return <li onClick={() => router.push(`/projects/${item.id}/overview/`)} key={item.id} className={styles['project-list-item']}>
        <div className={styles['project-list-item-column']}>
          {item.template && item.template.name ?
          <div className={styles['project-list-info']}>
            <span className={styles['project-list-info-name']}>Template name</span>
            <span className={styles['project-list-info-value']}>{item.template.name}</span>
          </div> : null}

          <div className={styles['project-list-info']}>
            <span className={styles['project-list-info-name']}>Interviewer</span>
            <span className={styles['project-list-info-value']}></span>

            <ul className={styles['project-list-interviewer-list']}>
              {item.interviewers.map(i => <li key={i.id} className={styles['project-list-interviewer-list-item']}>{i.name}</li>)}
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
        </div>
        <CompactMenu className={styles['project-list-item-control']} options={options} onChoice={c => handleCompactMenuChoice(c, item)} />
      </li>
    })}
    {!data.length ? <li>{emptyText}</li> : null}
   </ul>
}

export default ProjectList;
