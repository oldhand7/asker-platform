import classNames from 'classnames';

import styles from './Icon.module.scss';

import ArrowRightSvg from './assets/icons/arrow-right.svg';

const ArrowRightIcon = ({ className, ...props }) => <ArrowRightSvg className={classNames(styles['icon'], styles['icon-arrow-right'], className)} {...props}/>;

export default ArrowRightIcon;
