import TelephoneSvg from './assets/icons/telephone.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const TelephoneIcon = ({ className }) => <TelephoneSvg className={classNames(styles['icon'], styles['icon-telephone'], className)} />;

export default TelephoneIcon;
