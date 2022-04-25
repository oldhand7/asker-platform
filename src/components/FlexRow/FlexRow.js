import classNames from 'classnames';

import styles from './FlexRow.module.scss';

const FlexRow = ({ children, className }) => {
  return <div className={classNames(styles['flex-row'], className)}>
    {children}
  </div>
}

export default FlexRow;
