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
import FilterIcon from 'components/Icon/FilterIcon';
import CompactMenu from 'components/CompactMenu/CompactMenu';

import styles from './ProjectInterviewsTable.module.scss';

const getColumns = ({ handleCompactMenuChoice }) => ([
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
        const sa = a.score / a.maxScore;
        const sb = b.score / b.maxScore;

        if (sa < sb) return -1;
        if (sa > sb) return 1;

        return 0;
      });

      return <div className={styles['project-interviews-table-evaluations']}>
          {evas.reverse().slice(0, 3).map((e, index) => <EvaluationScore key={index} evaluation={e} className={styles['project-interviews-table-evaluations-evaluation']} />)}
      </div>
    }
  },
  {
    title: <FilterIcon />,
    render: (_, row) => <CompactMenu options={[
      typeof row.score === 'undefined' ?
      { id: 'start', name: 'Start interview' } :
      { id: 'edit', name: 'Edit response' }
    ]} onChoice={c => handleCompactMenuChoice(c, row)} />
  }
]);

const ProjectInterviewsTable = ({ className, data = [], ...props }) => {
  const router = useRouter()

  const handleCompactMenuChoice = (c, rec) => {
    if (c.id == 'edit' || c.id == 'start') {
      router.push(`/interviews/${rec.id}/conduct/`)
    }
  }

  return <Table rowKey={row => row.id} className={classNames(
    styles['project-interviews-table'],
    className
  )} columns={getColumns({ handleCompactMenuChoice })} data={data} {...props} />
}

export default ProjectInterviewsTable;
