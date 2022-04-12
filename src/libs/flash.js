import { useState, useEffect } from 'react';

export const getFlash = (type = 'success') => {
  if (typeof window === 'undefined') {
    return;
  }

  const flash = localStorage.getItem('flash');

  if (flash) {
    const message = JSON.parse(flash);

    if (message.type == type) {
      localStorage.removeItem('flash');

      return message.message
    }
  }

  return;
}


export const addFlash = (message = '', type = 'success') => {
  if (typeof window === 'undefined') {
    return;
  }


  window.localStorage.setItem('flash', JSON.stringify({
    message,
    type
  }))
}

export const useFlash = (type = 'success') => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setMessage(getFlash(type))
  }, [])

  return message
}
