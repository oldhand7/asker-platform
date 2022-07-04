import BackSvg from './assets/icons/back.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss'; 

const BackIcon = ({ className }) => <BackSvg className={classNames(styles['icon'], styles['icon-back'], className)} />;

export default BackIcon;
 