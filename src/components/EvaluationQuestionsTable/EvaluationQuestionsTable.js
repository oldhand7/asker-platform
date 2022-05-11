import Table from 'rc-table';
import classNames from 'classnames';
import PlusIcon from 'components/Icon/PlusIcon';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';
import striptags from 'striptags';
import TrashButton from 'components/TrashButton/TrashButton';
import NODATA from 'components/NODATA/NODATA';

import styles from './EvaluationQuestionsTable.module.scss';

const getColumns = ({ onQuestion, criteria = false, onDelete }) => {
  const columns = [
    {
      title: 'Questions',
      dataIndex: 'name',
      key: 'name',
      render: (name, row) => <div className={styles['evaluation-questions-table-label']}>
        <span className={styles['evaluation-questions-table-label-name']}>{name}</span>
      </div>
    }
  ];

  if (criteria && EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(criteria) == -1) {
    columns.push({
      title: 'Criteria',
      dataIndex: 'criteria',
      key: 'criteria',
      render: (criteria) => {
        return criteria && criteria.name || <NODATA />;
      }
    })
  }

  columns.push({
      title: '',
      key: 'action',
      render: (_, q) => <div>
        {onDelete ?   <TrashButton onClick={() => onDelete(q)} className={styles['evaluation-questions-table-delete']} /> : null}
        {onQuestion ?  <button type="button"
          className={styles['evaluation-questions-table-add']}
          onClick={() => onQuestion(q)}><PlusIcon /></button> : null}
      </div>
  })

  return columns
};

const tagRow = (rec) => {
  if (!rec || !rec.id) return;

  return {
      'data-company-id': rec.companyId
  }
}

const EvaluationQuestionsTable = ({ className, data = [], onQuestion, onDelete, criteria, ...props }) => {
  return <Table onRow={tagRow} emptyText="No questions found." rowKey={row => row.id} className={classNames(
    styles['evaluation-questions-table'],
    className
  )} columns={getColumns({ onQuestion, criteria, onDelete })} data={data} {...props} />
}

export default EvaluationQuestionsTable;
