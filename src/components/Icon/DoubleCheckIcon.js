import DoubleCheckSvg from './assets/icons/double-check.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const DoubleCheckIcon = ({ className }) => <DoubleCheckSvg className={classNames(styles['icon'], styles['icon-double-check'], className)} />;

export default DoubleCheckIcon;
