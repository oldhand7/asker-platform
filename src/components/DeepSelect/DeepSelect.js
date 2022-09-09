import classNames from "classnames";
import { useState, memo, useRef, useEffect } from "react";
import CarretDownIcon from 'components/Icon/CarretDownIcon';
import CarretUpIcon from 'components/Icon/CarretUpIcon';
import PopupMenu from 'components/PopupMenu/PopupMenu';

import styles from './DeepSelect.module.scss';

const DeepSelect = ({ className, option, options = [], placeholder = 'Choose', actions = [], emptyWarning = 'No templates', onChange, onAction }) => {
    const [selectedOption, setSelectedOption] = useState(option);

    useEffect(() => {
        setSelectedOption(option)
    }, [option])

    const ref = useRef();
    const [open, setOpen] = useState(false);

    const handleSelect = (option) => {
        setSelectedOption(option);
        setOpen(false);
        onChange && onChange(option)
    }

    const handleAction = (action, option) => {
        setOpen(false);
        onAction && onAction(action, option)
    }

    useEffect(() => {
        if (!open) {
          return;
        }
    
        const handleOffClick = ev => {
          if (ref && ref.current && ev.target != ref.current && !ref.current.contains(ev.target)) {
            setOpen(false)
          }
        }
    
        document.body.addEventListener('click', handleOffClick, true)
    
        return () => {
          document.body.removeEventListener('click', handleOffClick, true)
        }
      }, [open])

    const toggleMenu = () => {
        setOpen(!open)
    }

    return <div data-status={open ? 'open' : 'closed'} ref={ref} className={classNames(
        styles['deep-select'],
        className,
        open ? styles['deep-select-open'] : ''
        )}>
        <div onClick={toggleMenu} className={styles['deep-select-head']}>
            <div className={styles['deep-select-head-label']}>
                {selectedOption && selectedOption.name || placeholder}
            </div>
            {
                !open ?
                <CarretDownIcon className={styles['deep-select-head-icon']} /> :
                <CarretUpIcon className={styles['deep-select-head-icon']} />
            }
        </div>
        {
            open ?
            <div className={styles['deep-select-body']}>
                {
                    !options.length ?
                    <p>{emptyWarning}</p> :
                    <ul className={styles['deep-select-menu']}>
                        {options.map((o, index) => {
                            const optionActions = [
                                ...(o.actions || []),
                                ...actions
                            ]

                            return <li onClick={() => handleSelect(o)} className={styles['deep-select-menu-item']} key={index}>
                                <span className={styles['deep-select-menu-item-name']}>{o.name}</span>
                                <PopupMenu className={styles['deep-select-menu-item-control']} onChange={a => handleAction(a, o)} items={optionActions} />
                            </li>
                        })}
                    </ul>
                }
            </div> : null
        }
    </div>
}

const DeepSelectMemo = memo(DeepSelect, (prev, next) => {
    if (prev.option != next.option) {
        return false;
    }

    return JSON.stringify(prev.options) == JSON.stringify(next.options);
})

DeepSelectMemo.displayName = 'DeepSelect';

export default DeepSelectMemo;