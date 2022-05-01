import ArrowDownSvg from './assets/icons/arrow-down.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ArrowUpIcon = ({ className }) => <ArrowDownSvg className={classNames(styles['icon'], styles['icon-arrow-up'], className)} />;

export default ArrowUpIcon;
