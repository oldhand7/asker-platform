import Modal from 'components/Modal/Modal';
import CriteriaOptionForm from 'forms/criteria-option/criteria-option-form';

import styles from './criteria-option-modal.module.scss';

const CriteriaOptionModal = ({ onResult, type, values, ...props }) => {
  return <Modal id="criteria-option-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <CriteriaOptionForm values={values} type={type} onValues={val => onResult(val, true)} />
  </Modal>
}

export default CriteriaOptionModal;
