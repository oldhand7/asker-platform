import BoxesSvg from './assets/icons/boxes.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const BoxesIcon = ({ className }) => <BoxesSvg className={classNames(styles['icon'], styles['icon-boxes'], className)} />;

export default BoxesIcon;
