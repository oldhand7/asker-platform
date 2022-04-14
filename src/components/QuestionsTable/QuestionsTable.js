import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectTableStatCell from 'components/ProjectTableStatCell/ProjectTableStatCell';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import InterviewScore from 'components/InterviewScore/InterviewScore';
import PlatformButton from 'components/Button/PlatformButton';
import PlayIcon from 'components/Icon/PlayIcon';
import { criteriaTypes } from 'libs/criteria';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import FilterIcon from 'components/Icon/FilterIcon';

import styles from './QuestionsTable.module.scss';

const getColumns = ({ handleCompactMenuChoice }) => ([
  {
    title: 'Type of question',
    dataIndex: 'criteria',
    key: 'criteria',
    render: (criteria, row) => {
      const ct = criteriaTypes.find(c => c.id == criteria.type)

      if (!ct) {
        return <NODATA />
      }

      return <span className={classNames(styles['questions-table-criteria'], styles[`questions-table-criteria-${row.companyId}`])}>{ct.name}</span>
    }
  },
  {
    title: 'Criterion',
    dataIndex: 'criteria',
    key: 'criteria',
    render: (criteria) => {
      return criteria.name;
    }
  },
  {
    title: 'Question',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Follow up questions',
    dataIndex: 'followup',
    key: 'followup',
    render: (questions) => questions && questions.length ? <ul>
      {questions.map((q, index) => <li key={`q${index}`}>{q}</li>)}
    </ul> : <NODATA />
  },
  {
    title: <FilterIcon />,
    key: 'action',
    render: (_, row) => <CompactMenu options={[
      row.companyId === 'asker' ?
      { id: 'clone', name: 'Clone' } :
      { id: 'edit', name: 'Edit' }
    ]} onChoice={c => handleCompactMenuChoice(c, row)} />
  }
]);

const QuestionsTable = ({ className, data = [], ...props }) => {
  const router = useRouter()

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'clone' || c.id == 'edit') {
      router.push(`/questions/${row.id}/edit/`)
    }
  }

  return <Table rowKey={row => row.id} className={classNames(
    styles['questions-table'],
    className
  )} columns={getColumns({ handleCompactMenuChoice })} data={data} {...props} />
}

export default QuestionsTable;
