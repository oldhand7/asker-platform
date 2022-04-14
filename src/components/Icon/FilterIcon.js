import FilterSvg from './assets/icons/filter.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const FilterIcon = ({ className }) => <FilterSvg className={classNames(styles['icon'], styles['icon-filter'], className)} />;

export default FilterIcon;
