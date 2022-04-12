import classNames from 'classnames';
import useForm from 'libs/use-form';
import ResetIcon from 'components/Icon/ResetIcon'
import SearchIcon from 'components/Icon/SearchIcon'

import { useRef, useEffect } from 'react';

import styles from './SearchWidget.module.scss';

//@TODO: refactor without useForm if works
const SearchWidget = ({ className, value = '', onQuery, onQueryValue }) => {
  const [values, errors, control] = useForm({ values: { q: '' } })

  const ref = useRef()

  const handleQuery = (values) => {
    if (onQuery) {
      onQuery(values)
    }

    control.set('q', '')
  }

  const handleSubmit = () => {
    if (values.q && onQuery) {
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

  useEffect(() => {
    control.set('q', value)
  }, [value])

  useEffect(() => {
    if (onQueryValue) {
      onQueryValue(values.q)
    }
  }, [values.q])

  return <div className={classNames(styles['search-widget'], className)}>
    <input value={values.q} ref={ref} onChange={control.input('q')} className={styles['search-widget-input']} name="q" placeholder="Search" />
    {
      values.q ?
      <ResetIcon onClick={() => control.set('q', '')} className={classNames(styles['search-widget-icon'], styles['search-widget-icon-close'])} /> :
      <SearchIcon onClick={handleSubmit} className={classNames(styles['search-widget-icon'], styles['search-widget-icon-search'])} />
    }
  </div>
}

export default SearchWidget;
