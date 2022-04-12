import SearchSvg from './assets/icons/search.svg';
import classNames from 'classnames';

import styles from './Icon.module.scss';

const SearchIcon = ({ className, ...props }) => <SearchSvg className={classNames(styles['icon'], styles['icon-search'], className)} {...props} />;

export default SearchIcon;
