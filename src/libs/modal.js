import { createContext } from 'react';
import { useContext, useState } from "react";

export const ModalContext = createContext();

export const withModal = (WrappedComponent) => {
  const withModal = (props) => {
    const { pageProps: { config } } = props;
    const [modal, setModal] = useState(null)

    return (
      <ModalContext.Provider value={[setModal, () => setModal(null)]}>
      <WrappedComponent
        {...props}
      />
      <>{modal}</>
      </ModalContext.Provider>
    );
  };

  return withModal;
};

export const useModal = (ModalComponent) => {
  const [open, close] = useContext(ModalContext)

  return (onResult)=>{
    const handleResult = (result, autoclose = false) => {
      if (onResult) {
        onResult(result)
      }

      if (autoclose) {
        close()
      }
    }

    open(<ModalComponent onResult={handleResult} onClose={close} />)
  }
}
