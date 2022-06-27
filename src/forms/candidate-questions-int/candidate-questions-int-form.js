import classNames from 'classnames';

import styles from './candidate-questions-int-form.module.scss';

const CandidateQuestionsIntForm = ({ className, last, nextId, markComplete }) => {
  return <div className={classNames(styles['candidate-questions-int-form'], className)}>
    <h2 className={styles['candidate-questions-int-form-title']}>
      Candidate questions
    </h2>
    <div className={styles['candidate-questions-int-form-desc']}>
      Now it is time for the candidate to ask her/his questions
    </div>
  </div>
}

export default CandidateQuestionsIntForm;
