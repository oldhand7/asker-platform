import classNames from 'classnames';

import styles from './NODATA.module.scss';

const NODATA = ({ className }) => {
  return <span className={classNames(styles['nodata'], className)}></span>
}

export default NODATA;
