import classNames from 'classnames';
import styles from './Modal.module.scss';

const Modal = ({ onClose, className, size = 'medium', children }) => {
  return <div className={classNames(styles['modal'], className, styles[`modal-${size}`])} onClick={onClose}>
    <div onClick={e=> e.stopPropagation()} className={styles['modal-content']}>
      {children}
    </div>
  </div>
}

export const createModalElement = (selector = '#container') => {
  const div = document.createElement('div');
  document.querySelector(selector).appendChild(div);
  return div;
}

export default Modal;
