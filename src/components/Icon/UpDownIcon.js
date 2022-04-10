import UpDownSvg from './assets/icons/up-down.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const UpDownIcon = ({ className }) => <UpDownSvg className={classNames(styles['icon'], styles['icon-up-down'], className)} />;

export default UpDownIcon;
