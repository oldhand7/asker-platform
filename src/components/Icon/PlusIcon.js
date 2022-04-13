import PlusSvg from './assets/icons/plus.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const PlusIcon = ({ className }) => <PlusSvg className={classNames(styles['icon'], styles['icon-plus'], className)} />;

export default PlusIcon;
