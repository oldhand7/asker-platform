import Modal, { createModalElement } from 'components/Modal/Modal';
import ScreeningQuestionForm from 'forms/screening-question/screening-question-form';
import ReacDOM from 'react-dom';
import { useSite } from 'libs/site';

import styles from './screening-question-modal.module.scss';

const ScreeningQuestionModal = ({ onResult, type = 'screening', ...props }) => {
  return <Modal id="screening-question-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
     <ScreeningQuestionForm type={type} onValues={val => onResult(val, true)} />
  </Modal>
}

export default ScreeningQuestionModal;
