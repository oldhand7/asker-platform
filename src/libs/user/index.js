import { useAuth } from './auth';
import { createContext, useContext } from 'react';

export const UserContext = createContext();

export const withUser = (WrappedComponent) => {
  return (props) => {
    const auth = useAuth();

    return (
      <UserContext.Provider value={auth}>
        <WrappedComponent {...props} />
      </UserContext.Provider>
    );
  };
};

export const useUser = () => useContext(UserContext)
