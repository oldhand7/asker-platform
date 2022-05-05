import ListSvg from './assets/icons/list.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ListIcon = ({ className }) => <ListSvg className={classNames(styles['icon'], styles['icon-list'], className)} />;

export default ListIcon;
