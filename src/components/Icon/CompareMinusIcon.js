import CompareMinusSvg from './assets/icons/compare-minus.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const CompareMinusIcon = ({ className }) => <CompareMinusSvg className={classNames(styles['icon'], styles['icon-minus-compare'], className)} />;

export default CompareMinusIcon;
