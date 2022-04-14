import PlatformButton from 'components/Button/PlatformButton';
import classNames from 'classnames';
import { useState, useEffect, useRef } from 'react';

import styles from './DropDownButton.module.scss';

const DropDownButton = ({ options = [], onChoice, children, className }) => {
  const [open, setOpen] = useState(false);

  const ref = useRef()

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOffClick = ev => {
      if (ev.target != ref.current && !ref.current.contains(ev.target)) {
        setOpen(false)
      }
    }

    document.body.addEventListener('click', handleOffClick)

    return () => {
      document.body.removeEventListener('click', handleOffClick)
    }
  }, [open])

  const handleChoice = (o) => {
    setOpen(false);
    onChoice(o)
  }

  return <div ref={ref} className={classNames(styles['drop-down-button'], className)}>
    <PlatformButton className={styles['drop-down-button-button']} onClick={() => setOpen(!open)}>{children}</PlatformButton>
    {
      open ?
      <ul className={styles['drop-down-button-options']}>
        {options.map(o => <li onClick={() => handleChoice(o)} className={styles['drop-down-button-options-item']} key={o.id}>{o.name}</li>)}
      </ul> :
      null
    }
  </div>
}

export default DropDownButton;
