import classNames from 'classnames';
import useForm from 'libs/use-form';
import ResetIcon from 'components/Icon/ResetIcon'
import SearchIcon from 'components/Icon/SearchIcon'
import { useRef, useEffect, useState } from 'react';

import styles from './LiveSearchWidget.module.scss';

const LiveSearchWidget = ({ className, onQuery }) => {
  const [q, setQuery] = useState('');

  const ref = useRef()

  const handleQuery = (ev) => {
    setQuery(ev.target.value);
  }

  useEffect(() => {
    onQuery(q)
  }, [q])

  return <div className={classNames(styles['live-search-widget'], className)}>
    <input value={q} ref={ref} onChange={handleQuery} className={styles['live-search-widget-input']} name="q" placeholder="Search" />
    {
      q ?
      <ResetIcon onClick={() => setQuery('')} className={classNames(styles['live-search-widget-icon'], styles['live-search-widget-icon-close'])} /> :
      <SearchIcon className={classNames(styles['live-search-widget-icon'], styles['live-search-widget-icon-search'])} />
    }
  </div>
}

export default LiveSearchWidget;
