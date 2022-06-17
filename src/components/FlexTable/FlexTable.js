import classNames from 'classnames';
import { useMemo, useCallback } from 'react';

import styles from './FlexTable.module.scss';

const FlexTable = ({ className, columns = [], data = [], onRow, onColumn, rowKey, rowExtra, emptyLabel = 'No data', sizes = [] }) => {

  const tableEmpty = useMemo(() => !data || data.length == 0, [data])

  const getColumnStyle = useCallback(index => (
    {
      flex: `0 1 ${sizes && sizes[index] ? sizes[index] : '100%'}`,
      maxWidth: sizes && sizes[index] ? sizes[index] : 'auto'
    }
  ), [sizes])

  return <div data-test-id="flex-table" className={classNames(styles['flex-table'], className, tableEmpty ? styles['flex-table-empty'] : '')}>
      <div data-test-id="flex-table-head" className={styles['flex-table-head']}>
        {columns.map((c, cIndex) => <div data-test-id="flex-table-column" style={getColumnStyle(cIndex)} key={c.key || cIndex} onClick={() => onColumn&& onColumn(c, cIndex)} className={styles['flex-table-column']}>
          {c.title}
        </div>)}
      </div>
      <div data-test-id="flex-table-body" className={styles['flex-table-body']}>
        {data.map((row, rIndex) => {
          return <div data-test-id="flex-table-row"  key={rowKey ? rowKey(row) : rIndex}
          onClick={() => onRow && onRow(row, rIndex)} className={styles['flex-table-row']}>
            {columns.map((c, cIndex) => {
              const d = c.dataIndex ? row[c.dataIndex] : null;

              return <div data-test-id="flex-table-column" style={getColumnStyle(cIndex)} key={c.key || cIndex} className={styles['flex-table-column']}>
                {c.render ? c.render(d, row, rIndex) : d}
              </div>
            })}
            {rowExtra ? rowExtra(row, rIndex) : null}
          </div>
        })}
        {tableEmpty ? <p className={styles['flex-table-empty-message']}>{emptyLabel}</p>: null}
      </div>
  </div>
}

export default FlexTable;
