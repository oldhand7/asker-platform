import VerticalDotsSvg from './assets/icons/vertical-dots.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const VerticalDotsIcon = ({ className }) => <VerticalDotsSvg className={classNames(styles['icon'], styles['icon-vertical-dots'], className)} />;

export default VerticalDotsIcon;
