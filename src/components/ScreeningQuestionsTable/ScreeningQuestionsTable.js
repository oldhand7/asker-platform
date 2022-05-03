import Table from 'rc-table';
import classNames from 'classnames';
import PlusIcon from 'components/Icon/PlusIcon';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';

import styles from './ScreeningQuestionsTable.module.scss';

const getColumns = ({ onQuestion, criteria }) => ([
  {
    title: 'Questions',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'subtype',
    key: 'type',
    render: (subtype) => {
      return getScreeningQuestionLabelBySubtype(subtype);
    }
  },
  {
    title: '',
    key: 'action',
    render: (_, q) => <button type="button" className={styles['screening-questions-table-add']} onClick={() => onQuestion(q)}><PlusIcon /></button>
  }
]);

const tagRow = (rec) => {
  if (!rec || !rec.id) return;

  return {
      'data-company-id': rec.companyId
  }
}

const ScreeningQuestionsTable = ({ className, data = [], onQuestion, criteria, ...props }) => {
  return <Table onRow={tagRow} emptyText="No questions found." rowKey={row => row.id} className={classNames(
    styles['screening-questions-table'],
    className
  )} columns={getColumns({ onQuestion, criteria })} data={data} {...props} />
}

export default ScreeningQuestionsTable;
