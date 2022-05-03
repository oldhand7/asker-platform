import Modal from 'components/Modal/Modal';
import EvaluationQuestionForm from 'forms/evaluation-question/evaluation-question-form';

import styles from './evaluation-question-modal.module.scss';

const EvaluationQuestionModal = ({ onResult, type, ...props }) => {
  return <Modal id="ealuation-question-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <EvaluationQuestionForm subtype={type} onValues={val => onResult(val, true)} />
  </Modal>
}

export default EvaluationQuestionModal;
