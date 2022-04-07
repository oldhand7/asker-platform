import classNames from 'classnames';

import styles from './MenuToggle.module.scss';

const MenuToggle = ({ active = false, onClick, className }) => {
  return <button className={classNames(styles['menu-toggle'], className)} onClick={onClick}>
    {
      !active ?
      <svg className={styles['menu-toggle-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/></svg> :
      <svg className={styles['menu-toggle-icon']}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
    }
  </button>
}

export default MenuToggle;
