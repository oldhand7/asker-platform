import classNames from 'classnames';
import styles from './Modal.module.scss';
import CloseIcon from 'components/Icon/ResetIcon';

const Modal = ({ onClose, className, size = 'medium', children, id }) => {
  return <div id={id} className={classNames(styles['modal'], className, styles[`modal-${size}`])} onClick={onClose}>
    <div onClick={e=> e.stopPropagation()} className={styles['modal-content']}>
      {children}
      <button onClick={onClose} className={styles['modal-close']}>
        <CloseIcon className={styles['modal-close-icon']} />
      </button>
    </div>
  </div>
}

export const createModalElement = (selector = '#container') => {
  const div = document.createElement('div');
  document.querySelector(selector).appendChild(div);
  return div;
}

export default Modal;
