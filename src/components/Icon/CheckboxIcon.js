import classNames from 'classnames';
import CheckboxCheckedSvg from './assets/icons/checkbox-checked.svg';
import CheckboxEmptySvg from './assets/icons/checkbox-empty.svg';

import styles from './Icon.module.scss';

const CheckboxIcon = ({ className, checked = false }) => {
    return checked ?
    <CheckboxCheckedSvg className={classNames(styles['icon'], styles['icon-checkbox'], styles['icon-checkbox-cheked'], className)} /> :
    <CheckboxEmptySvg className={classNames(styles['icon'], styles['icon-checkbox'], styles['icon-checkbox-empty'], className)} />
}

export default CheckboxIcon;
 