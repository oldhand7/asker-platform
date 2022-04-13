import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectTableStatCell from 'components/ProjectTableStatCell/ProjectTableStatCell';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import InterviewScore from 'components/InterviewScore/InterviewScore';
import PlatformButton from 'components/Button/PlatformButton';
import PlayIcon from 'components/Icon/PlayIcon';

import styles from './ProjectInterviewsTable.module.scss';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (_, row) => row.candidate.name
  },
  {
    title: 'Total Interview Score',
    dataIndex: 'score',
    key: 'score',
    render: (score) => {
      return typeof score !== 'undefined' ? <InterviewScore score={5} /> : <NODATA />;
    }
  },
  {
    title: 'Evaluations scores',
    dataIndex: 'evaluation-scores',
    key: 'evaluations',
    render: (evaluations, interview) => {
      if (typeof interview.score === 'undefined') {
        return <PlatformButton href={`/interviews/${interview.id}/conduct`}>
          <PlayIcon /> Start interview</PlatformButton>
      }

      return <div className={styles['project-candidate-table-evaluations']}>
          <NODATA />{/* @TODO */}
      </div>
    }
  }
];

const ProjectInterviewsTable = ({ className, data = [], ...props }) => {
  const router = useRouter()

  const rowHandler = record => {
    if (typeof record.score === "undefined") {
      return;
    }

    return {
      onClick: () => {
        router.push(`/projects/interview/${record.id}`)
      }
    }
  }

  return <Table onRow={rowHandler} rowKey={row => row.id} className={classNames(
    styles['project-interviews-table'],
    className
  )} columns={columns} data={data} {...props} />
}

export default ProjectInterviewsTable;
