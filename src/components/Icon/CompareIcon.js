import CompareSvg from './assets/icons/compare.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const CompareIcon = ({ className }) => (
    <CompareSvg
        className={classNames(styles['icon'], styles['icon-compare'], className)} />
)

export default CompareIcon;
