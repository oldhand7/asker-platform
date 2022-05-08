import Table from 'rc-table';
import classNames from 'classnames';
import PlusIcon from 'components/Icon/PlusIcon';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';

import styles from './EvaluationQuestionsTable.module.scss';

const getColumns = ({ onQuestion, criteria }) => {
  const columns = [
    {
      title: 'Questions',
      dataIndex: 'name',
      key: 'name'
    }
  ];

  if (EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(criteria.id) == -1) {
    columns.push({
      title: criteria.name || 'Criteria',
      dataIndex: 'criteria',
      key: 'criteria',
      render: (criteria) => {
        return criteria.name;
      }
    })
  }

  columns.push({
      title: '',
      key: 'action',
      render: (_, q) => <button type="button"
      className={styles['evaluation-questions-table-add']}
      onClick={() => onQuestion(q)}><PlusIcon /></button>
  })

  return columns
};

const tagRow = (rec) => {
  if (!rec || !rec.id) return;

  return {
      'data-company-id': rec.companyId
  }
}

const EvaluationQuestionsTable = ({ className, data = [], onQuestion, criteria, ...props }) => {
  return <Table onRow={tagRow} emptyText="No questions found." rowKey={row => row.id} className={classNames(
    styles['evaluation-questions-table'],
    className
  )} columns={getColumns({ onQuestion, criteria })} data={data} {...props} />
}

export default EvaluationQuestionsTable;
