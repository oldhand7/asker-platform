import ExclamationSvg from './assets/icons/exclamation.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ExclamationIcon = ({ className }) => <ExclamationSvg className={classNames(styles['icon'], styles['icon-exclamation'], className)} />;

export default ExclamationIcon;
