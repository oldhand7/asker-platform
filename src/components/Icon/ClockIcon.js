import ClockSvg from './assets/icons/clock.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ClockIcon = ({ className }) => <ClockSvg className={classNames(styles['icon'], styles['icon-clock'], className)} />;

export default ClockIcon;
