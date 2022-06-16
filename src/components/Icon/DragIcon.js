import DragSvg from './assets/icons/drag.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const DragIcon = ({ className }) => <DragSvg className={classNames(styles['icon'], styles['icon-drag'], className)} />;

export default DragIcon;
