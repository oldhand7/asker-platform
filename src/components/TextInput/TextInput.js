import { useRef, useEffect, useState, forwardRef } from 'react'
import classNames from 'classnames';

import styles from './TextInput.module.scss';

const TextInput = ({ focus, className, name = '', type="text", onFocus, onBlur, onKeyDown, onEnter, onEscape, ...props }) => {
  const [focused, setFocused] = useState(false)

  const ref = useRef();

  useEffect(() => {
    if (focus && ref.current) {
      ref.current.focus()
    }
  }, [focus])

  useEffect(() => {
    if (!focused) return;

    const keyHandler = (ev) => {
      if (ev.code == "Enter" || ev.code == "NumpadEnter") {
        onEnter && ev.preventDefault();
        onEnter && onEnter(ev)
      }

      if (ev.code == "Escape") {
        onEscape && onEscape(ev)
      }

      onKeyDown && onKeyDown(ev)
    }

    document.addEventListener('keydown', keyHandler);

    return () => {
      document.removeEventListener('keydown', keyHandler);
    }
  }, [focused, onKeyDown, onEnter, onEscape])

  const handleFocus = (ev) => {
    setFocused(true);
    onFocus && onFocus(ev);
  }

  const handleBlur = (ev) => {
    setFocused(false);
    onBlur && onBlur(ev)
  }

  return <input data-focus={focused ? 'focus' : 'nofocus'} onFocus={handleFocus} onBlur={handleBlur} type={type} name={name} className={classNames(styles['text-input'], className)} ref={ref} {...props} />
}

export default TextInput
