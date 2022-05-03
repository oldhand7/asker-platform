import classNames from 'classnames';
import ResetIcon from 'components/Icon/ResetIcon'
import SearchIcon from 'components/Icon/SearchIcon'

import styles from './LiveSearchWidget.module.scss';

const LiveSearchWidget = ({ q = '', className, onQuery, ...props }) => {
  return <div className={classNames(styles['live-search-widget'], className)}>
    <input type="text" autoComplete="off" value={q} onChange={e => onQuery(e.target.value)} className={styles['live-search-widget-input']} name="q" placeholder="Search" {...props} />
    {
      q ?
      <ResetIcon onClick={() => onQuery('')} className={classNames(styles['live-search-widget-icon'], styles['live-search-widget-icon-close'])} /> :
      <SearchIcon className={classNames(styles['live-search-widget-icon'], styles['live-search-widget-icon-search'])} />
    }
  </div>
}

export default LiveSearchWidget;
