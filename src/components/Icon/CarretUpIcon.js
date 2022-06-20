import Icon from './Icon';
import CarretDownSvg from './assets/icons/carret-down.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const CarretUp = ({ className }) => <Icon icon={<CarretDownSvg />} className={classNames(styles['icon-carret-up'], className)} />;

export default CarretUp;
