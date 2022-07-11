import YesNoSvg from './assets/icons/yes-no.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss'; 

const YesNoIcon = ({ className }) => <YesNoSvg className={classNames(styles['icon'], styles['icon-yes-no'], className)} />;

export default YesNoIcon;
 