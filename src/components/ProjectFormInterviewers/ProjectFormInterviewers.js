import classNames from 'classnames';
import TrashIcon from 'components/Icon/TrashIcon'
import SearchWidget from 'components/SearchWidget/SearchWidget'

import styles from './ProjectFormInterviewers.module.scss';

const ProjectFormInterviewers = ({ className, interviewers = [], onChange }) => {
  const handleDeleteInterviewer = (interviewer) => {
    onChange([
      ...interviewers.filter(i => i != interviewer)
    ])
  }

  const handleInterviewerQuery = (q) => {
    //@TODO
  }

  return <div className={classNames(styles["project-form-interviewers"], className)}>
    <SearchWidget className={styles['project-form-interviewers-autocomplete']} onQuery={handleInterviewerQuery} />
    {/* @TODO: autocomplete */}

    <div className={styles['project-form-interviewers-list']}>
      {interviewers.map(interviewer => <div key={`interviewer-${interviewer.id || interviewer.name}`} className={styles['project-form-interviewers-list-item']}>
        <span className={styles['project-form-interviewers-list-item-title']}></span>
        <button onClick={() => handleDeleteInterviewer(interviewer)} className={styles['project-form-interviewers-list-item-button']}>
          <TrashIcon className={styles['project-form-interviewers-list-item-button-icon']} />
        </button>
      </div>)}
    </div>
  </div>
}

export default ProjectFormInterviewers;
