import classNames from 'classnames';
import { useState, useEffect, useRef } from 'react';
import VerticalDotsIcon from 'components/Icon/VerticalDotsIcon'

import styles from './CompactMenu.module.scss';

const CompactMenu = ({ options = [], onChoice, orientation = 'right', children, className }) => {
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

  return <div ref={ref} className={classNames(styles['compact-menu'], className, styles[`compact-menu-${orientation}`])}>
    <button onClick={() => setOpen(!open)} className={styles['compact-menu-button']}>
      <VerticalDotsIcon className={styles['compact-menu-button-icon']} />
    </button>
    {
      open ?
      <ul className={styles['compact-menu-options']}>
        {options.map(o => <li onClick={() => handleChoice(o)} className={styles['compact-menu-options-item']} key={o.id}>{o.name}</li>)}
      </ul> :
      null
    }
  </div>
}

export default CompactMenu;
