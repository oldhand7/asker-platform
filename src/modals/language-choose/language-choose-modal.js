import Modal from 'components/Modal/Modal';
import LanguageChooseForm from 'forms/language-choose/language-choose-form';

import styles from './language-choose-modal.module.scss';

const CandidateChooseModal = ({ onResult, ...props }) => {
  return <Modal id="language-choose-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <LanguageChooseForm onValues={val => onResult(val, true)} {...(props.formProps || {})} />
  </Modal>
}

export default CandidateChooseModal;
