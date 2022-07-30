import Modal from 'components/Modal/Modal';
import QuestionNoteForm from 'forms/question-note/question-note-form';

import styles from './question-note-modal.module.scss';

const QuestionNoteModal = ({ onResult, note, ...props }) => {
  return <Modal id="question-note-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <QuestionNoteForm values={note} onValues={val => onResult(val, true)} />
  </Modal>
}

export default QuestionNoteModal;
