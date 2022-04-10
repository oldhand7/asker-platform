import classNames from 'classnames';
import useForm from 'libs/use-form';
import SearchIcon from './assets/icons/search.svg'
import { useRef, useEffect } from 'react';

import styles from './SearchWidget.module.scss';

const SearchWidget = ({ className, onQuery }) => {
  const [values, errors, control] = useForm({ values: { q: '' } })

  const ref = useRef()

  const handleQuery = (values) => {
    if (onQuery) {
      onQuery(values)
    }

    control.set('q', '')
  }

  const handleSubmit = () => {
    if (!errors) {
      onQuery(values.q)
    }
  }

  useEffect(() => {
    const keyDownHandler = (ev) => {
      if (ev.code == "Enter" || ev.code == "NumpadEnter") {
        ev.preventDefault();

        handleSubmit();

        ref.current.value = '';

        return false;
      }
    }

    if (ref && ref.current) {
      ref.current.addEventListener('keydown', keyDownHandler, true)

      return () => {
        if (ref.current)
          ref.current.removeEventListener('keydown', keyDownHandler, true)
      }
    }
  }, [values])


  return <div className={classNames(styles['search-widget'], className)}>
    <input ref={ref} onChange={control.input('q')} className={styles['search-widget-input']} name="q" placeholder="Search" />
    <SearchIcon onClick={handleSubmit} className={styles['search-widget-icon']} />
  </div>
}

export default SearchWidget;
