import Table from 'rc-table';
import classNames from 'classnames';
import PlusIcon from 'components/Icon/PlusIcon';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import TrashButton from 'components/TrashButton/TrashButton';

import styles from './ScreeningQuestionsTable.module.scss';
import { useTransition } from 'react';

const getColumns = ({ onQuestion, criteria, onDelete, t }) => ([
  {
    title: t('labels.questions'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('labels.type'),
    dataIndex: 'subtype',
    key: 'type',
    render: (subtype) => {
      return getScreeningQuestionLabelBySubtype(subtype, t);
    }
  },
  {
    title: '',
    key: 'action',
    render: (_, q) => <div>
      {onDelete ?   <TrashButton onClick={() => onDelete(q)} className={styles['evaluation-questions-table-delete']} /> : null}
      {onQuestion ? <button data-test-id="add-question" type="button" className={styles['screening-questions-table-add']} onClick={() => onQuestion(q)}><PlusIcon /></button> : null}
    </div>
  }
]);

const tagRow = (rec) => {
  if (!rec || !rec.id) return;

  return {
      'data-company-id': rec.companyId
  }
}

const ScreeningQuestionsTable = ({ className, data = [], onQuestion, criteria, onDelete, ...props }) => {
  const { t } = useTransition();

  return <Table onRow={tagRow} emptyText={t('status.no-questions')} rowKey={row => row.id} className={classNames(
    styles['screening-questions-table'],
    className
  )} columns={getColumns({ onQuestion, criteria, onDelete, t })} data={data} {...props} />
}

export default ScreeningQuestionsTable;
