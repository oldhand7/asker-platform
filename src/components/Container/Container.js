import classNames from 'classnames';

import styles from './Container.module.scss';

const Container = ({ className, children }) => {
  return <div className={classNames(styles['container'], className)}>{children}</div>
}

export default Container;
