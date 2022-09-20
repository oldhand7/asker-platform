import VerticalDotsIcon from "components/Icon/VerticalDotsIcon";
import classNames from "classnames";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

import styles from './PopupMenu.module.scss';

const PopupMenu = ({ children, className, items = [], onChange, open = false, drag = false }) => {
    const [_open, setOpen] = useState(open)
    
    useEffect(() => {
        setOpen(open);
    }, [open])

    useEffect(() => {
        if (drag) {
            setOpen(false)
        }
    }, [drag])

    useEffect(() => {
      if (!_open) return;
  
      const handleOffClick = ev => {
        setOpen(false)
      }
  
      document.body.addEventListener('click', handleOffClick, { capture: true })
  
      return () => {
        document.body.removeEventListener('click', handleOffClick, { capture: true })
      }
    }, [_open])

    const buttonRef = useRef(null);
    const [coordinates, setCoordinates] = useState(false);

    const adjustCoordinate = () => {
        const {
            top,
            left
        } = buttonRef.current.getBoundingClientRect()

        setCoordinates({ top, left })
    }

    const togglePopup = ev => {
        ev.stopPropagation();

        adjustCoordinate()
        setOpen(!_open)
    }

    useEffect(() => {
        if (_open) {
            window.addEventListener('scroll', adjustCoordinate, { capture: true });
            window.addEventListener('resize', adjustCoordinate);

            return () => {
                window.removeEventListener('scroll', adjustCoordinate , { capture: true });
                window.removeEventListener('resize', adjustCoordinate);
            }
        }
    }, [_open, coordinates])

    const popupStyle = useMemo(() => {
        if (!_open) {
            return {}
        }
        
        return {
            left: coordinates.left + 'px',
            top: coordinates.top + 'px'
        }
    }, [_open, coordinates])

    return <div data-status={_open ? 'open' : 'closed'} className={classNames(
        styles['popup-menu'],
        _open && styles['popup-menu-open'],
        className
    )}>
        <button ref={buttonRef} type="button" onClick={togglePopup} className={styles['popup-menu-trigger']}>{children || <VerticalDotsIcon className={styles['popup-menu-trigger-icon']} />}</button>
        {items.length ? <ul style={popupStyle}  className={styles['popup-menu-list']}>
            {
                items.map(item => {
                    const Icon = item.icon || null

                    return <li data-id={item.id} onClick={(ev) => {
                            ev.stopPropagation(); onChange && onChange(item)
                    }} className={styles['popup-menu-list-item']} key={item.id}>
                        {Icon ? <Icon className={styles['popup-menu-list-item-icon']} /> : null}
                        <span className={styles['popup-menu-list-item-text']}>{item.name}</span>
                    </li>
                })
            }
        </ul> : null}
    </div>
}

export default PopupMenu;