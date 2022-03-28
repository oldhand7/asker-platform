import { useState } from 'react';
import classNames from 'classnames';
import styles from './Alert.module.scss';

const Alert = ({ type = 'danger' , children, className, close = true }) => {
  const [open, setOpen] = useState(true);

  return open ? <div className={classNames(styles['alert'], className, styles[`alert-${type}`])}>
    <div className={styles['alert-message']}>{children}</div>

    {
      close ?
      <span onClick={() => setOpen(false)} className={styles['alert-close']}>
        <svg className={styles['alert-close-icon']} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
      </span> : null
    }
  </div> : null;
}

export default Alert;
