import BSvg from './assets/icons/b.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const BIcon = ({ className }) => <BSvg className={classNames(styles['icon'], styles['icon-b'], className)} />;

export default BIcon;
