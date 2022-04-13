import PlaySvg from './assets/icons/play.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const PlayIcon = ({ className }) => <PlaySvg className={classNames(styles['icon'], styles['icon-play'], className)} />;

export default PlayIcon;
