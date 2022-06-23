import PauseSvg from './assets/icons/pause.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const PauseIcon = ({ className }) => <PauseSvg className={classNames(styles['icon'], styles['icon-pause'], className)} />;

export default PauseIcon;
