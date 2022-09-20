import classNames from 'classnames';

import styles from './Content.module.scss';

const Content = ({ className, children, fullWidth = false }) => {
  return <div className={classNames(styles['content'], className, fullWidth && styles['content-full-width'])}>{children}</div>
}

export default Content;
