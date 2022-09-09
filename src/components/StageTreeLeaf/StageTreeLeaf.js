
import classNames from 'classnames';
import ClockIcon from 'components/Icon/ClockIcon';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import TriangleRightIcon from 'components/Icon/TriangleRightIcon';
import { useCallback } from 'react';
import { useTranslation } from 'libs/translation';

import styles from './StageTreeLeaf.module.scss';

const StageTreeLeaf = ({ drag = false, hasChildren = false, expanded = false, Icon = null, actions = [], onAction, className, error, label = '', time = '', onClick, active = false, level=1 }) => {
    const  handleClick = useCallback((ev) => {
        if (onClick) {
            ev.stopPropagation();
            
            onClick(ev)
        }
    }, [onClick])

    return <div data-test-id="stage-tree-leaf" data-error={error || '0'} data-status={active ? 'active' : ''} onClick={handleClick} data-level={level} className={classNames(
        styles['stage-tree-leaf'],
        hasChildren && styles['stage-tree-leaf-has-children'],
        className,
        error ? styles['stage-tree-leaf-error'] : '',
        active ? styles['stage-tree-leaf-active'] : '',
        expanded ? styles['stage-tree-leaf-expanded'] : ''
        )}>
        <div

            className={styles['stage-tree-leaf-head']}>
            {
                hasChildren ?
                <TriangleRightIcon className={styles['stage-tree-leaf-triangle']} /> : null
            }
            {Icon && <Icon className={styles['stage-tree-leaf-icon']} />}

            <span className={styles['stage-tree-leaf-name']}>{label || '???'}</span>

            {time ?
            <span className={styles['stage-tree-leaf-time']}>
                <ClockIcon className={styles['stage-tree-leaf-time-icon']} />
                <span className={styles['stage-tree-leaf-time-text']}>{time}m</span>
            </span> : null}

            {actions && actions.length ?
            <PopupMenu drag={drag} onChange={onAction} items={actions} className={styles['stage-tree-leaf-popup-menu']} /> : null}
        </div>
    </div>
}

export default StageTreeLeaf;