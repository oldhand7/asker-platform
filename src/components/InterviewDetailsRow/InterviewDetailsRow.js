import classNames from 'classnames';
import IconButton from 'components/IconButton/IconButton'
import IconCarretUp from 'components/Icon/CarretUpIcon';
import IconCarretDown from 'components/Icon/CarretDownIcon';
import { useState } from 'react';

import styles from './InterviewDetailsRow.module.scss';

const InterviewDetailsRow = ({ name = '', defaultOpen = false, className, evaluation, children, head = null, headerColumnWidth = 25 }) => {
  const [rowOpen, setRowOpen] = useState(defaultOpen);

  const handleToggle = e => {
    e.preventDefault();
    setRowOpen(!rowOpen)
  }

  return <div data-test-id="interview-details-row" className={classNames(
    styles['interview-details-row'],
    children ? styles['interview-details-row-has-children'] : null,
    className
  )}>
    <div onClick={handleToggle} className={styles['interview-details-row-head']}>
      <div className={styles['interview-details-row-label']} style={{ flex: `0 1 ${headerColumnWidth}%`}}>{name}</div>
      {head}
      {
        children ?
        <IconButton
          className={styles['interview-details-row-toggle']}
          Icon={rowOpen ? IconCarretUp : IconCarretDown} /> :
        null
      }
    </div>
    {rowOpen ? children : null}
  </div>
}

export default InterviewDetailsRow;
