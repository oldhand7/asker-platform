import classNames from 'classnames';

import styles from './candidate-questions-stage-form.module.scss';

const CandidateQuestionsStageForm = ({ className }) => {
  return <div className={classNames(styles['candidate-questions-stage-form'], className)}>
    <h3 className={styles['candidate-questions-stage-form-title']}>Candidate questions</h3>
    <div className={styles['candidate-questions-stage-form-desc']}>
      Remember to ask candidates if they have some questions.
    </div>
  </div>
}


export default CandidateQuestionsStageForm;
