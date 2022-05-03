import { useRef, useEffect, useState } from 'react'
import classNames from 'classnames';

import styles from './TextInput.module.scss';

const TextInput = ({ focus, className, name = '', type="text", onFocus, onBlur, onKeyDown, onEnter, ...props }) => {
  const [focused, setFocused] = useState(false)

  const ref = useRef();
  
  useEffect(() => {
    if (focus && ref.current) {
      ref.current.focus()
    }
  }, [focus])

  useEffect(() => {
    if (focused && onEnter) {
      const keyHandler = (ev) => {
        if (ev.code == "Enter" || ev.code == "NumpadEnter") {
          ev.preventDefault();

          onEnter(ev)
        }
      }

      document.addEventListener('keydown', keyHandler);

      return () => {
        document.removeEventListener('keydown', keyHandler);
      }
    }
  }, [focused, onEnter])

  const handleFocus = (ev) => {
    if (onFocus) {
      return onFocus(ev);
    }

    setFocused(true);
  }

  const handleBlur = (ev) => {
    if (onBlur) {
      return onBlur(ev);
    }

    setFocused(false);
  }

  return <input onFocus={handleFocus} onBlur={handleBlur} type={type} id={`input-${name}`} name={name} className={classNames(styles['text-input'], className)} ref={ref} {...props} />
}

export default TextInput
