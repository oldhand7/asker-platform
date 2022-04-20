import Table from 'rc-table';
import classNames from 'classnames';
import NODATA from 'components/NODATA/NODATA';
import PlusIcon from 'components/Icon/PlusIcon';

import styles from './EvaluationQuestionsTable.module.scss';

const getColumns = ({ onQuestion, criteria }) => ([
  {
    title: 'Questions',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: criteria.name || 'Criteria',
    dataIndex: 'criteria',
    key: 'criteria',
    render: (criteria) => {
      return criteria.name;
    }
  },
  {
    title: '',
    key: 'action',
    render: (_, q) => <button type="button" className={styles['evaluation-questions-table-add']} onClick={() => onQuestion(q)}><PlusIcon /></button>
  }
]);

const EvaluationQuestionsTable = ({ className, data = [], onQuestion, criteria, ...props }) => {
  return <Table emptyText="No questions found." rowKey={row => row.id} className={classNames(
    styles['evaluation-questions-table'],
    className
  )} columns={getColumns({ onQuestion, criteria })} data={data} {...props} />
}

export default EvaluationQuestionsTable;
