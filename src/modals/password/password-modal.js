import Modal from 'components/Modal/Modal';
import PasswordForm from 'forms/password/password-form';

import styles from './password-modal.module.scss';

const PasswordModal = ({ onResult }) => {
  return <Modal id="password-modal" className={`${styles['modal']}`} onClose={() => onResult(null, true)}>
    <PasswordForm onValues={val => onResult(val, true)} />
  </Modal>
}

export default PasswordModal;
