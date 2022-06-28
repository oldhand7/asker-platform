import { createContext } from 'react';
import { useContext, useState, useCallback, useEffect } from "react";

export const ModalContext = createContext();

export const withModal = (WrappedComponent) => {
  const withModal = (props) => {
    const [modals, setModals] = useState([])

    const addModal = modal => {
      setModals([
        ...modals,
        modal
      ])
    }

    const closeModal = useCallback(() => {
      setModals([
        ...modals.slice(-1)
      ])
    }, [modals])

    useEffect(() => {
      if (modals.length == 1) {
        document.body.classList.add('modal');
      }

      if (modals.length == 0) {
        document.body.classList.remove('modal');
      }
    }, [modals])

    return (
      <ModalContext.Provider value={[addModal, closeModal]}>
      <WrappedComponent {...props} />
      {
        modals.map((m, index) => <div key={'modal'+index} className={index < modals.length - 1 ? 'modal-hide' : null}>{m}</div>)
      }
      <style jsx>{`
        .modal-hide {
          display: none;
        }
     `}</style>
      </ModalContext.Provider>
    );
  };

  return withModal;
};

export const useModal = (ModalComponent, options = {}) => {
  const { size = 'medium', ...props } = options;
  const [open, close] = useContext(ModalContext)

  return (onResult, modalProps = {})=>{
    const handleResult = (result, autoclose = false) => {
      if (onResult) {
        onResult(result)
      }

      if (autoclose) {
        close()
      }
    }

    open(<ModalComponent onResult={handleResult} onClose={close} size={size} {...props} {...modalProps} />)
  }
}
