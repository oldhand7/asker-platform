import NumListSvg from './assets/icons/num-list.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const NumListIcon = ({ className }) => <NumListSvg className={classNames(styles['icon'], styles['icon-num-list'], className)} />;

export default NumListIcon;
