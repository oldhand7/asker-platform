import Modal from 'components/Modal/Modal';
import ContactForm from 'forms/contact/contact-form';

import styles from './contact-modal.module.scss';

const ContactModal = ({ onClose }) => {
  const handleClose = () => {
    setTimeout(() => {
      if (onClose) {
        onClose()
      }
    }, 2000)
  }

  return <Modal className={`${styles['modal']}`} onClose={onClose}><ContactForm onSuccess={handleClose} /></Modal>
}

export default ContactModal;
