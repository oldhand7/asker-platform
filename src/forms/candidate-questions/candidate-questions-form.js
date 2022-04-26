import classNames from 'classnames';

import styles from './candidate-questions-form.module.scss';

const CandidateQuestionsForm = ({ className }) => {
  return <div className={classNames(styles['candidate-questions-form'], className)}>
    <h3 className={styles['candidate-questions-form-title']}>Candidate questions</h3>
    <div className={styles['candidate-questions-form-desc']}>
      Remember to ask candidates if they have some questions.
    </div>
  </div>
}


export default CandidateQuestionsForm;
