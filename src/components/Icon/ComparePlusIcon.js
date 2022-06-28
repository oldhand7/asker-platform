import ComparePlusSvg from './assets/icons/compare-plus.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const ComparePlusIcon = ({ className }) => (
    <ComparePlusSvg
        className={classNames(styles['icon'], styles['icon-compare-plus'], className)} />
)

export default ComparePlusIcon;
