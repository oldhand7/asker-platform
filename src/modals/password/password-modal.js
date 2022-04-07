import Modal, { createModalElement } from 'components/Modal/Modal';
import PasswordForm from 'forms/password/password-form';
import ReacDOM from 'react-dom';
import { useSite } from 'libs/site';

import styles from './password-modal.module.scss';

const PasswordModal = ({ onResult }) => {
  return <Modal className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <PasswordForm onSuccess={val => onResult(val, true)} />
  </Modal>
}

export default PasswordModal;
