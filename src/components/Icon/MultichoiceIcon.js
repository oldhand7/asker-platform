import MultichoiceSvg from './assets/icons/multichoice.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const MultichoiceIcon = ({ className }) => <MultichoiceSvg className={classNames(styles['icon'], styles['icon-multichoice'], className)} />;

export default MultichoiceIcon;
 