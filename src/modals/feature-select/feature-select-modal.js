import Modal, { createModalElement } from 'components/Modal/Modal';
import FeatureSelectForm from 'forms/feature-select/feature-select-form';
import ReacDOM from 'react-dom';

import styles from './feature-select-modal.module.scss';

const FeatureSelectModal = ({ onResult, ...props }) => {
  return <Modal id="feature-select-modal" {...props} className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <FeatureSelectForm onValues={val => onResult(val, true)} />
  </Modal>
}

export default FeatureSelectModal;
