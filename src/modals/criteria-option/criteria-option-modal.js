import Modal, { createModalElement } from 'components/Modal/Modal';
import CriteriaOptionForm from 'forms/criteria-option/criteria-option-form';
import ReacDOM from 'react-dom';
import { useSite } from 'libs/site';

import styles from './criteria-option-modal.module.scss';

const CriteriaOptionModal = ({ onResult, type, ...props }) => {
  return <Modal id="criteria-option-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <CriteriaOptionForm type={type} onValues={val => onResult(val, true)} />
  </Modal>
}

export default CriteriaOptionModal;
