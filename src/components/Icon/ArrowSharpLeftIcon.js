import classNames from 'classnames';

import styles from './Icon.module.scss';

import ArrowSharpRightSvg from './assets/icons/arrow-sharp-right.svg';

const ArrowSharpLeftIcon = ({ className, ...props }) => <ArrowSharpRightSvg className={classNames(styles['icon'], styles['icon-arrow-sharp-left'], className)} {...props}/>;

export default ArrowSharpLeftIcon;
  