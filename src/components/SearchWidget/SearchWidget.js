import classNames from 'classnames';
import useForm from 'libs/use-form';
import SearchIcon from './assets/icons/search.svg'

import styles from './SearchWidget.module.scss';

const SearchWidget = ({ className, onQuery }) => {
  const [values, errors, control] = useForm({ values: { q: '' } })

  const handleQuery = (values) => {
    if (onQuery) {
      onQuery(values)
    }

    control.set('q', '')
  }

  return <form
    className={classNames(styles['search-widget'], className)}
    onSubmit={control.submit(handleQuery)}>
    <input onChange={control.input('q')} className={styles['search-widget-input']} name="q" placeholder="Search" />
    <SearchIcon className={styles['search-widget-icon']} />
  </form>
}

export default SearchWidget;
