import classNames from 'classnames';
import PaginationComp from "react-js-pagination";

import styles from './Pagination.module.scss';

const Pagination = ({ className, page = 1, perPage = 10, total = 0, ...props }) => {
  return  <PaginationComp
    activePage={page}
    itemsCountPerPage={perPage}
    totalItemsCount={total}
    pageRangeDisplayed={5}
    innerClass={classNames(styles['pagination'], className)}
    itemClass={styles['pagination-item']}
    disabledClass={styles['pagination-item-disabled']}
    activeClass={styles['pagination-item-active']}
    {...props}
    />
}

export default Pagination;
