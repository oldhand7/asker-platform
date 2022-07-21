import classNames from 'classnames';
import RangeSvg from './assets/icons/range.svg';

import styles from './Icon.module.scss';

const RangeIcon = ({ className }) => (
    <RangeSvg className={classNames(styles['icon'], styles['icon-range'], className)} />
)

export default RangeIcon;
 