import classNames from 'classnames';
import CheckboxIcon from 'components/Icon/CheckboxIcon';

import styles from './Button1.module.scss';

const CheckboxButton = ({ className, checked = false, text = 'Some button', onClick, children, theme = '' }) => {
    return <button type="button" onClick={onClick} className={classNames(
        styles['button-checkbox'],
        styles[`button-checkbox-${theme}`],
        className
    )}>
        <CheckboxIcon className={styles['button-checkbox-icon']} checked={checked} />
        <span className={styles['button-checkbox-text']}>{children || text}</span>
    </button>
}

export default CheckboxButton;