import classNames from 'classnames';

import styles from './Icon.module.scss';

import ArrowSharpRightSvg from './assets/icons/arrow-sharp-right.svg';

const ArrowSharpRightIcon = ({ className, ...props }) => <ArrowSharpRightSvg className={classNames(styles['icon'], styles['icon-arrow-sharp-right'], className)} {...props}/>;

export default ArrowSharpRightIcon;
