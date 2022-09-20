const { default: classNames } = require("classnames");
const { useState } = require("react")
import ExclamationIcon from 'components/Icon/ExclamationIcon';

import styles from './DismissAlert.module.scss';

const DismissAlert = ({ className, text='', children, onDismiss }) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);

        if (onDismiss) {
            onDismiss();
        }
    }

    return open ? <div
    data-test-id="dismiss-alert"
    className={classNames(
        styles['dismiss-alert'],
        className
    )}>
        <ExclamationIcon className={styles['dismiss-alert-icon']} />
        <div className={styles['dismiss-alert-message']}>{text ? text : children}</div>
        <button className={styles['dismiss-alert-close']} onClick={handleClose}>OK</button>
        <span className='clearfix'></span>
        </div> : null
}

export default DismissAlert;