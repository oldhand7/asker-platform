import { useRef } from 'react'
import classNames from 'classnames';
import Icon from 'components/Icon/Icon';
import styles from './TextInput.module.scss';

const TextInput = ({ className, type = 'text', value = '', onChange, autocomplete = 'on', placeholder = '', icon }) => {
  const ref = useRef();

  const handleIconClick = () => {
    if (ref.current) {
      ref.current.focus()
    }
  }

  return <div className={classNames(styles['text-input-wrapper'], className)}>
    {icon ? <div onClick={handleIconClick} className={styles['text-input-icon']}>
      <Icon icon={icon} />
    </div> : null}
    <input className={styles['text-input']} ref={ref} type={type} value={value} onChange={onChange} autoComplete={autocomplete} placeholder={placeholder} />
  </div>
}

export default TextInput
