import Modal from 'components/Modal/Modal';
import CandidateChooseForm from 'forms/candidate-choose/candidate-choose-form';

import styles from './candidate-modal.module.scss';

const CandidateChooseModal = ({ onResult, ...props }) => {
  return <Modal id="candidate-choose-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <CandidateChooseForm onValues={val => onResult(val, true)} {...(props.formProps || {})} />
  </Modal>
}

export default CandidateChooseModal;
