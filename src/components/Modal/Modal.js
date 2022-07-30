import classNames from 'classnames';
import CloseIcon from 'components/Icon/ResetIcon';
import { useEffect } from 'react'

import styles from './Modal.module.scss';

const Modal = ({ onClose, className, size = 'medium', children, id }) => {
  useEffect(() => {
    const handleKey = (ev) => {
      if (ev.code == "Escape") {
        ev.preventDefault();

        onClose();
      }
    }

    document.body.addEventListener('keyup', handleKey);

    return () => {
      document.body.removeEventListener('keyup', handleKey);
    }
  }, [onClose])

  return <div role="dialog" id={id} className={classNames(styles['modal'], className, styles[`modal-${size}`])} onClick={onClose}>
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
