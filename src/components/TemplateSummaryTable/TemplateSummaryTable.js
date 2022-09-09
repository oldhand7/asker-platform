import Table from 'rc-table';
import classNames from 'classnames';
import ArrowRightIcon from 'components/Icon/ArrowRightIcon';
import Button from 'components/Button/TryButton';
import { useTranslation } from 'libs/translation';

import styles from './TemplateSummaryTable.module.scss';

const getColumns = ({ onTemplate, t }) => ([
  {
    title: t('labels.template'),
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: t('labels.stages'),
    dataIndex: 'stages',
    render: (stages) => {
      return stages.length;
    }
  },
  {
    title: '',
    key: 'action',
    render: (_, tpl) => <Button type="button" className={styles['template-summary-table-add']} onClick={() => onTemplate(tpl)}>{t('actions.use-this')} <ArrowRightIcon /></Button>
  }
]);

const tagRow = (rec) => {
  if (!rec || !rec.id) return;

  return {
      'data-company-id': rec.companyId
  }
}

const TemplateSummaryTable = ({ className, data = [], onTemplate, ...props }) => {
  const { t } = useTranslation();

  return <Table onRow={tagRow} emptyText={t('status.no-templates')} rowKey={row => row.id} className={classNames(
    styles['template-summary-table'],
    className
  )} columns={getColumns({ onTemplate, t })} data={data} {...props} />
}

export default TemplateSummaryTable;
