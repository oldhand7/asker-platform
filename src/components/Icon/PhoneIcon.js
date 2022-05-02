import PhoneSvg from './assets/icons/phone.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const PhoneIcon = ({ className }) => <PhoneSvg className={classNames(styles['icon'], styles['icon-phone'], className)} />;

export default PhoneIcon;
