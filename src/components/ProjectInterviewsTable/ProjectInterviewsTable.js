import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectTableStatCell from 'components/ProjectTableStatCell/ProjectTableStatCell';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import InterviewScore from 'components/InterviewScore/InterviewScore';
import PlatformButton from 'components/Button/PlatformButton';
import PlayIcon from 'components/Icon/PlayIcon';
import EvaluationScore from 'components/EvaluationScore/EvaluationScore';

import styles from './ProjectInterviewsTable.module.scss';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (_, row) => row.candidate.name
  },
  {
    title: 'Total interview score',
    dataIndex: 'score',
    key: 'score',
    render: (score) => {
      return typeof score !== 'undefined' ? <InterviewScore score={score || 0} /> : <NODATA />;
    }
  },
  {
    title: 'Evaluations scores',
    dataIndex: 'evaluations',
    key: 'evaluations',
    render: (stages, interview) => {
      if (typeof interview.score === 'undefined') {
        return <PlatformButton href={`/interviews/${interview.id}/conduct`}>
          <PlayIcon /> Start interview</PlatformButton>
      }


      if (!stages) {
        return <NODATA />
      }

      const scoredEvaluations = Object.values(stages).map(stage => Object.values(stage).filter(eva => eva.score))

      let evas = [];

      for (let i = 0; i < scoredEvaluations.length; i++) {
        evas = [
          ...evas,
          ...scoredEvaluations[i]
        ]
      }

      evas.sort(function(a, b) {
        if (a.score < a.score) return -1;
        if (a.score > a.score) return 1;

        return 0;
      });

      return <div className={styles['project-interviews-table-evaluations']}>
          {evas.slice(0, 3).map((e, index) => <EvaluationScore key={index} evaluation={e} className={styles['project-interviews-table-evaluations-evaluation']} />)}
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
        router.push(`/interviews/${record.id}/conduct/`)
      }
    }
  }

  return <Table onRow={rowHandler} rowKey={row => row.id} className={classNames(
    styles['project-interviews-table'],
    className
  )} columns={columns} data={data} {...props} />
}

export default ProjectInterviewsTable;
