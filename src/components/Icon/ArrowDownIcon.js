import ArrowDownSvg from './assets/icons/arrow-down.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ArrowDownIcon = ({ className }) => <ArrowDownSvg className={classNames(styles['icon'], styles['icon-arrow-down'], className)} />;

export default ArrowDownIcon;
