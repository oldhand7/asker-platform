import SelectSvg from './assets/icons/select.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const SelectIcon = ({ className }) => <SelectSvg className={classNames(styles['icon'], styles['icon-select'], className)} />;

export default SelectIcon;
