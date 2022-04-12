import ReactPaginate from 'react-paginate';
import classNames from 'classnames';

import styles from './Pagination.module.scss';

const Pagination = ({ className, ...props }) => {
  return <ReactPaginate className={classNames(styles['pagination'], className)} {...props} />
}

export default Pagination;
