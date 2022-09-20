import TriangleRightSvg from './assets/icons/triangle-right.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const TriangleRightIcon = ({ className }) => <TriangleRightSvg className={classNames(styles['icon'], styles['icon-triangle-right'], className)} />;

export default TriangleRightIcon;
