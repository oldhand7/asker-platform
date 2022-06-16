import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import EditFieldIcon from 'components/Icon/EditFieldIcon';
import TextInput from 'components/TextInput/TextInput';

import styles from './EditInput.module.scss';

const EditInput = ({ className, label = 'Edit', value = '', onChange, placeholder=''}) => {
  const [mode, setMode] = useState('read');
  const [_value, setValue] = useState(value);

  const ref = useRef();

  useEffect(() => {
    if (mode != 'edit') return;

    const handleOffClick = ev => {
      if (ref && ref.current && ev.target != ref.current && !ref.current.contains(ev.target)) {
        setMode('read')
        onChange(_value)
      }
    }

    const enterHandler = (ev) => {
      if (ev.code == "Enter" || ev.code == "NumpadEnter") {
        ev.preventDefault();

        setMode('read')
        onChange(_value)
      }
    }

    document.body.addEventListener('click', handleOffClick, true)
    document.addEventListener('keydown', enterHandler);

    return () => {
      document.body.removeEventListener('click', handleOffClick, true);
      document.removeEventListener('keydown', enterHandler);
    }
  }, [mode, _value])

  return <div ref={ref} onClick={() => setMode('edit')} className={classNames(
    styles['edit-input'],
    className,
    styles[`edit-input-${mode}`]
  )}>
    {
      mode == 'edit' ?
      <TextInput focus={true} className={styles['edit-input-input']} value={_value} onChange={e => setValue(e.target.value)} placeholder={placeholder} /> :
      <>
        <span className={styles['edit-input-label']}>{label}</span>
        <EditFieldIcon className={styles['edit-input-icon']} />
      </>
    }
  </div>
}

export default EditInput;
