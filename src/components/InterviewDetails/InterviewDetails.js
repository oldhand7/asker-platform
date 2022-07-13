import classNames from 'classnames';

import styles from './InterviewDetails.module.scss';

const InterviewDetails = ({ className, interview, children }) => {
    const handleClick = e => e.stopPropagation()

    return <div onClick={handleClick} className={classNames(styles['interview-details'], className)}>
    {
      interview.status == 'awaiting' ?
      <p className={styles['interview-details-awaiting']}>Interview awaiting.</p> :
      children
    }
  </div>
}

export default InterviewDetails;
