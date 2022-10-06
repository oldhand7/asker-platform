import { criteriaTypes } from 'libs/criteria';
import classNames from 'classnames';
import { questionTypes } from 'libs/questions';
import { useTranslation } from 'libs/translation';

import styles from './QuestionFilter.module.scss';

const options = [
    ...criteriaTypes,
    ...questionTypes.filter(qt => qt.id != 'evaluation')
]

const QuestionFilter = ({ className, selected = [], onFilter }) => {
  const { t } = useTranslation();

  const toggleOption = (option) => {
    const exists = selected.indexOf(option) > -1;

    onFilter([
      ...exists ?
        selected.filter(o => o != option) :
        [...selected, option]
    ])
  }

  return <ul data-test-id="question-filter" className={classNames(styles['question-filter'], className)}>
    {options.map(c => <li onClick={() => toggleOption(c)} key={c.id} className={classNames(
      styles['question-filter-item'],
      selected.indexOf(c) > -1 ? styles['question-filter-item-active'] : '',
    )}>{t(`labels.${c.id}`)}</li>)}
  </ul>
}

export default QuestionFilter;
