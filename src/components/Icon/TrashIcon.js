import TrashIconSvg from './assets/icons/trash.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const TrashIcon = ({ className }) => <TrashIconSvg className={classNames(styles['icon'], styles['icon-trash'], className)} />;

export default TrashIcon;
