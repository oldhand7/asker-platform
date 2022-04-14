import { criteriaTypes } from 'libs/criteria';
import classNames from 'classnames';

import styles from './CriteriaFilter.module.scss';

const CriteriaFilter = ({ className, selected = [], onFilter }) => {
  const toggleCriteria = (criteria) => {
    const exists = selected.find(c => c.id == criteria.id)

    onFilter([
      ...exists ?
        selected.filter(c => c.id != criteria.id) :
        [...selected, criteria]
    ])
  }

  return <ul className={classNames(styles['criteria-filter'], className)}>
    {criteriaTypes.map(c => <li onClick={() => toggleCriteria(c)} key={c.id} className={classNames(
      styles['criteria-filter-item'],
      selected.indexOf(c) > -1 ? styles['criteria-filter-item-active'] : '',
    )}>{c.name}</li>)}
  </ul>
}

export default CriteriaFilter;
