import Modal from 'components/Modal/Modal';
import CandidateForm from 'forms/candidate/candidate-form';

import styles from './candidate-modal.module.scss';

const CandidateModal = ({ onResult, ...props }) => {
  return <Modal {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <CandidateForm onValues={val => onResult(val, true)} />
  </Modal>
}

export default CandidateModal;
