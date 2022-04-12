import XSvg from './assets/icons/x.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ResetIcon = ({ className, ...props }) => <XSvg className={classNames(styles['icon'], styles['icon-x'], className)} {...props} />;

export default ResetIcon;
