import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectStat from 'components/ProjectStat/ProjectStat';
import { useRouter } from 'next/router';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import { dateFromTs } from 'libs/helper';
import styles from './TemplateList.module.scss';
import { useUser } from 'libs/user';
import NODATA from 'components/NODATA/NODATA';

const TemplateList = ({ className, data = [], onDelete, emptyText = 'No data', ...props }) => {
  const router = useRouter()
  const { user } = useUser();

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'edit') {
      router.push(`/templates/${row.id}/edit/`)
    }

    if (c.id == 'create-project') {
      router.push(`/projects/create/?template=${row.id}`)
    }
    if (c.id == 'delete' && onDelete) {
      onDelete(row)
    }
  }

   return <ul data-test-id="template-list" className={classNames(
    styles['template-list'],
    className
   )}>
    {data.map(item => {
      const options = [
        { id: 'edit', name: user && user.companyId == item.companyId ? 'Edit' : 'Edit copy' },
        { id: 'create-project', name: 'Create project' }
      ]

      if (user && user.companyId == item.companyId) {
        options.push({
          id: 'delete',
          name: 'Delete'
        })
      }

      return <li data-company-id={item.companyId} onClick={() => router.push(`/templates/${item.id}/edit/`)} key={item.id} className={styles['template-list-item']}>
        <div className={styles['template-list-item-column']}>
          <div className={styles['template-list-info']}>
            <span className={styles['template-list-info-name']}>Date created</span>
            <span className={styles['template-list-info-value']}>{dateFromTs(item.createdAt)}</span>
          </div>

          <div className={styles['template-list-info']}>
            <span className={styles['template-list-info-name']}>Created by</span>
            <span className={styles['template-list-info-value']}>{item.user && item.user.name || <NODATA />}</span>
          </div>
        </div>
        <div className={classNames(
          styles['template-list-item-column'],
          styles['template-list-details']
        )}>
            <div className={styles['template-list-details-head']}>
              <h2 className={styles['template-list-item-title']}>{item.templateName}</h2>
              <ProjectStat template={true} className={styles['template-list-stats']} project={item} />
            </div>
            <div className={styles['template-list-details-body']}>
              <Stager className={styles['template-list-stager']} stages={item.stages} />
            </div>
          <CompactMenu className={styles['template-list-item-control']} options={options} onChoice={c => handleCompactMenuChoice(c, item)} />
        </div>
      </li>
    })}
    {!data.length ? <li>{emptyText}</li> : null}
   </ul>
}

export default TemplateList;
