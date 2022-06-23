import InfoSvg from './assets/icons/info.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const InfoIcon = ({ className }) => <InfoSvg className={classNames(styles['icon'], styles['icon-info'], className)} />;

export default InfoIcon;
