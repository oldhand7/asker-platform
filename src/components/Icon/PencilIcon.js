import PencilSvg from './assets/icons/pencil.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const PencilIcon = ({ className }) => <PencilSvg className={classNames(styles['icon'], styles['icon-pencil'], className)} />;

export default PencilIcon;
