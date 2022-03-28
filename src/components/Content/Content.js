import classNames from 'classnames';

import styles from './Content.module.scss';

const Content = ({ className, children }) => {
  return <div className={classNames(styles['content'], className)}>{children}</div>
}

export default Content;
