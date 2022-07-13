import classNames from 'classnames';

import styles from './InterviewFormSidebar.module.scss';

const InterviewFormSidebar = ({ children, className}) => {
  return <div data-test-id="interview-sidebar" className={classNames(
    styles['interview-form-sidebar'],
    className
  )}>
      {children}
  </div>
}

export default InterviewFormSidebar;
