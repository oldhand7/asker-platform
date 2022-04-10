import { useRef, useEffect } from 'react'
import classNames from 'classnames';
import Icon from 'components/Icon/Icon';
import styles from './TextInput.module.scss';

const TextInput = ({ focus, className, name = '', ...props }) => {
  const ref = useRef();

  const handleIconClick = () => {
    if (ref.current) {
      ref.current.focus()
    }
  }

  useEffect(() => {
    if (focus && ref.current) {
      ref.current.focus()
    }
  }, [focus])

  return <input id={`input-${name}`} name={name} className={classNames(styles['text-input'], className)} ref={ref} {...props} />
}

export default TextInput
