import { useRef, useEffect } from 'react';

export const useComponentDidMount = () => {
    const ref = useRef();
    useEffect(() => {
      ref.current = true;
    }, []);
    return ref.current;
  };
  