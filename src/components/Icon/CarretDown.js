import Icon from './Icon';
import CarretDownSvg from './assets/icons/carret-down.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const CarretDown = ({ className }) => <Icon icon={<CarretDownSvg />} className={classNames(styles['icon-carret-down'], className)} />;

export default CarretDown;
