import classNames from 'classnames';
import SearchWidget from 'components/SearchWidget/SearchWidget'
import { useState, useEffect } from 'react';
import Autocomplete from 'components/Autocomplete/Autocomplete';
import { getCompanyEmployees } from 'libs/firestore';
import { useUser } from 'libs/user';
import TrashButton from 'components/TrashButton/TrashButton'

import styles from './ProjectFormInterviewers.module.scss';

const employee2interviewer = e => ({
  id: e.profile.uid,
  name: e.profile.displayName
})

const ProjectFormInterviewers = ({ className, interviewers = [], onChange }) => {
  const [autoCompleteOptions, setAutocompleteOptions] = useState([])

  const [user] = useUser();

  useEffect(() => {
    if (user.companyId) {
      getCompanyEmployees(user.companyId)
        .then(employees => setAutocompleteOptions(employees.map(employee2interviewer)))
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

  const handleQuery = q => {
    const regex = new RegExp(`(.*)${q.toLowerCase()}(.*)`)

    return Promise.resolve([
      ...autoCompleteOptions.filter(aco => regex.test(aco.name.toLowerCase()) && !interviewers.find(i => i.id == aco.id))
    ])
  }

  return <div className={classNames(styles["project-form-interviewers"], className)}>
    <Autocomplete
      onSearch={handleSearch}
      onQuery={handleQuery}
      className={styles['project-form-interviewers-autocomplete']}
    />

    <div className={styles['project-form-interviewers-list']}>
      {interviewers.map(interviewer => <div key={`interviewer-${interviewer.id || interviewer.name}`} className={styles['project-form-interviewers-list-item']}>
        <span className={styles['project-form-interviewers-list-item-name']}>{interviewer.name}</span>
        <TrashButton onClick={() => handleDeleteInterviewer(interviewer)} className={styles['project-form-interviewers-list-item-button']} />
      </div>)}
    </div>
  </div>
}

export default ProjectFormInterviewers;
