import classNames from 'classnames';
import { useState, useEffect } from 'react';
import FilterButton from 'components/Button/FilterButton';
import OutlineButton from 'components/Button/OutlineButton';
import LiveSearch from 'components/LiveSearchWidget/LiveSearchWidget';
import { useUser } from 'libs/user';
import TemplateSummaryTable from 'components/TemplateSummaryTable/TemplateSummaryTable';
import PlusIcon from 'components/Icon/PlusIcon';
import { getManyFromCollection } from 'libs/firestore';
import { useRouter } from 'next/router';

import styles from './TemplateExplorer.module.scss';

const TemplateExplorer = ({ className, onTemplate, label = '' }) => {
  const { user } = useUser();
  const [templates, settemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [filter, setFilter] = useState({ company: ['asker', user.companyId] })
  const router = useRouter();

  const toggleCompany = (companyId) => {
    const existsAlready = filter.company.find(c => c == companyId);

    setFilter({
      ...filter,
      company: existsAlready ?
        filter.company.filter(c => c != companyId) :
        [...filter.company, companyId]
    })
  }

  useEffect(() => {
    if (user) {
      getManyFromCollection('templates', [
        ['companyId', 'in', ['asker', user.companyId]]
      ], [['name', 'asc']]).then(settemplates)
    }
  }, [user])

  useEffect(() => {
    const { q, company } = filter;

    let filteredTemplates = templates.filter(t => {
      return company.indexOf(t.companyId) > -1
    });

    if (q && filteredTemplates.length) {
      const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

      filteredTemplates = filteredTemplates.filter(t => {
        const nameQ = regex.test(t.templateName.toLowerCase());

        return nameQ;
      })
    }

    setFilteredTemplates(filteredTemplates)
  }, [filter, templates])

  return <div className={classNames(styles['template-explorer'], className)}>
    {
      label ?
      <h3 className={styles['template-explorer-title']}>{label}</h3> :
      <h3 className={styles['template-explorer-title']}>Search template</h3>
    }

    <div className={styles['template-explorer-widget']}>
      <div className={styles['template-explorer-widget-header']}>
        <div className={styles['template-explorer-controls']}>
          <div className={styles['template-explorer-company-filter']}>
            <FilterButton theme='green' className={styles['template-explorer-company-filter-button']} active={filter.company.indexOf('asker') > -1} onClick={() => toggleCompany('asker')}>Asker templates</FilterButton>
            <FilterButton theme='grape' className={styles['template-explorer-company-filter-button']} active={filter.company.indexOf(user && user.companyId) > -1} onClick={() => toggleCompany(user && user.companyId)}>Your templates</FilterButton>
          </div>
          <OutlineButton className={styles['template-explorer-create-template']} onClick={() => router.push('/templates/create/')}><PlusIcon /> Create new template</OutlineButton>
        </div>
        <LiveSearch className={styles['template-explorer-live-search']} q={filter.q} onQuery={q => setFilter({ ...filter, q})} />
      </div>

      <div className={styles['template-explorer-widget-body']}>
        <TemplateSummaryTable className={styles['template-explorer-widget-table']} onTemplate={onTemplate} data={filteredTemplates} />
      </div>
    </div>
  </div>
}

export default TemplateExplorer;
