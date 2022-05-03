import classNames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import Autocomplete from 'components/Autocomplete/Autocomplete';
import { filterManyDocuments } from 'libs/firestore';
import { useUser } from 'libs/user';
import TrashButton from 'components/TrashButton/TrashButton'

import styles from './ProjectFormInterviewers.module.scss';

const employee2interviewer = e => ({
  id: e.id,
  name: e.name
})

const ProjectFormInterviewers = ({ className, interviewers = [], onChange }) => {
  const [autoCompleteOptions, setAutocompleteOptions] = useState([])

  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.companyId) {
      filterManyDocuments('users', [
        ['companyId', '==', user.companyId]
      ])
        .then(employees => {
          setAutocompleteOptions(employees.map(employee2interviewer))
        })
    } else {
      setAutocompleteOptions([employee2interviewer(user)])
    }
  }, [user])


  const handleDeleteInterviewer = (interviewer) => {
    onChange([
      ...interviewers.filter(i => i != interviewer)
    ])
  }

  const handleSearch = (item, query) => {
    onChange([
      ...interviewers,
      item
    ])
  }

  return <div data-test-id="interviewers" className={classNames(styles["project-form-interviewers"], className)}>
    <Autocomplete
      onSearch={handleSearch}
      options={autoCompleteOptions.filter(o => !interviewers.find(i => i.id == o.id))}
      className={styles['project-form-interviewers-autocomplete']}
    />

    <ul data-test-id="interviewers-list" className={styles['project-form-interviewers-list']}>
      {interviewers.map(interviewer => <li key={`interviewer-${interviewer.id || interviewer.name}`} className={styles['project-form-interviewers-list-item']}>
        <span className={styles['project-form-interviewers-list-item-name']}>{interviewer.name}</span>
        <TrashButton onClick={() => handleDeleteInterviewer(interviewer)} className={styles['project-form-interviewers-list-item-button']} />
      </li>)}
    </ul>
  </div>
}

export default ProjectFormInterviewers;
