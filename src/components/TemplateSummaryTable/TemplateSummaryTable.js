import Table from 'rc-table';
import classNames from 'classnames';
import ArrowRightIcon from 'components/Icon/ArrowRightIcon';
import Button from 'components/Button/TryButton';

import styles from './TemplateSummaryTable.module.scss';

const getColumns = ({ onTemplate }) => ([
  {
    title: 'Template',
    dataIndex: 'templateName',
    key: 'name'
  },
  {
    title: 'Stages',
    dataIndex: 'stages',
    key: 'stages',
    render: (stages) => {
      return stages.length;
    }
  },
  {
    title: '',
    key: 'action',
    render: (_, t) => <Button type="button" className={styles['template-summary-table-add']} onClick={() => onTemplate(t)}>Use this <ArrowRightIcon /></Button>
  }
]);

const tagRow = (rec) => {
  if (!rec || !rec.id) return;

  return {
      'data-company-id': rec.companyId
  }
}

const TemplateSummaryTable = ({ className, data = [], onTemplate, ...props }) => {
  return <Table onRow={tagRow} emptyText="No templates found." rowKey={row => row.id} className={classNames(
    styles['template-summary-table'],
    className
  )} columns={getColumns({ onTemplate })} data={data} {...props} />
}

export default TemplateSummaryTable;
