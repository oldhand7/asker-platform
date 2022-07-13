import CheckSvg from './assets/icons/check.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const CheckIcon = ({ className }) => <CheckSvg className={classNames(styles['icon'], styles['icon-check'], className)} />;

export default CheckIcon;
