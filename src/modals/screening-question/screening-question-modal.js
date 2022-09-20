import Modal from 'components/Modal/Modal';
import ScreeningQuestionForm from 'forms/screening-question/screening-question-form';

import styles from './screening-question-modal.module.scss';

const ScreeningQuestionModal = ({ onResult, type = 'screening', question, ...props }) => {
  return <Modal id={`${type}-question-modal`} {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
     <ScreeningQuestionForm question={question} type={type} onValues={val => onResult(val, true)} />
  </Modal>
}

export default ScreeningQuestionModal;
