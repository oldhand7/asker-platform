import Table from 'rc-table';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import InterviewScore from 'components/InterviewScore/InterviewScore';
import PlatformButton from 'components/Button/PlatformButton';
import PlayIcon from 'components/Icon/PlayIcon';
import EvaluationScore from 'components/EvaluationScore/EvaluationScore';
import FilterIcon from 'components/Icon/FilterIcon';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import Link from 'next/link';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';
import ArrowUpIcon from 'components/Icon/ArrowUpIcon';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';
import { getSubtype, ucFirst } from 'libs/helper';
import { getInterviewAggregate } from 'libs/interview';

import styles from './ProjectInterviewsTable.module.scss';

const getSortLink = (name, sort, order, project) => {
  return `/projects/${project.id}/overview/?sort=${name}&order=${sort == name ? (order == 'asc' ? 'desc' : 'asc') : 'asc'}`
}

const getSortArrowIcon = (name, sort, order) => {
  return name == sort ? (order == 'asc' ? <ArrowUpIcon/> : <ArrowDownIcon/>) : '';
}

const sumReducer = (sum, { score }) => {
  return Number.parseInt(score) + sum;
}

const getColumns = ({ handleCompactMenuChoice, project, sort, order }) => ([
  {
    title: <Link href={getSortLink('candidate.name', sort, order, project)}>
      <a>Name {getSortArrowIcon('candidate.name', sort, order)}</a>
    </Link>,
    dataIndex: 'name',
    render: (_, row) => row.candidate.name
  },
  {
    title: <Link href={getSortLink('score', sort, order, project)}>
      <a>Total interview score {getSortArrowIcon('score', sort, order)}</a>
    </Link>,
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
    render: (evaluations, interview) => {
      if (typeof interview.score === 'undefined') {
        return <PlatformButton href={`/interviews/${interview.id}/conduct`}>
          <PlayIcon /> Start interview</PlatformButton>
      }


      if (!evaluations) {
        return <NODATA />
      }

      const interviewEvaluations = []

      const aggregate = getInterviewAggregate(interview);
      const aggregateKeys = Object.keys(aggregate);

      for (let i = 0; i < aggregateKeys.length; i++) {
        const key = aggregateKeys[i];

        if (key == 'competency' || key == 'experience') {
          const criteriaKeys = Object.keys(aggregate[key]);

          for (let n = 0; n < criteriaKeys.length; n++) {
            const cKey = criteriaKeys[n];

            const score = aggregate[key][cKey].reduce(sumReducer, 0);

            if (!score) {
              continue;
            }

            const { criteria } = aggregate[key][cKey][0];

            interviewEvaluations.push({
              id: cKey,
              name: criteria.name,
              score: Math.round(score / aggregate[key][cKey].length),
              type: criteria.type
            })
          }
        } else if (key == 'hard-skill') {
          for (let n = 0; n < aggregate['hard-skill'].length; n++) {
            const { score, criteria } = aggregate['hard-skill'][n]

            interviewEvaluations.push({
              id: `hs-${criteria.id}`,
              name: ucFirst(criteria.name),
              score: Math.round(score / aggregate[key].length),
              type: 'hard-skill'
            })
          }
        } else {
          const score = aggregate[key].reduce(sumReducer, 0);

          if (!score) {
            continue;
          }

          interviewEvaluations.push({
            id: key,
            name: ucFirst(key),
            score: Math.round(score / aggregate[key].length),
            type: key
          })
        }
      }

      interviewEvaluations.sort(function(a, b) {
        if (a.type.toLowerCase() > b.type.toLowerCase()) return 1;
        if (a.type.toLowerCase() < b.type.toLowerCase()) return -1;

        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

        return 0;
      });

      return <div className={styles['project-interviews-table-evaluations']}>
          {
            interviewEvaluations.length ? interviewEvaluations.map((e, index) => (
              <EvaluationScore
                key={index}
                evaluation={e}
                className={styles['project-interviews-table-evaluations-evaluation']} />
            )) :
          <NODATA />}
      </div>
    }
  },
  {
    title: <a href={`/projects/${project.id}/overview/`}>
      <FilterIcon />
    </a>,
    render: (_, row) => {
      const options = [

      ]

      if (typeof row.score !== "undefined") {
        options.push({ id: 'edit', name: 'Edit response' })
      } else {
        options.push({ id: 'start', name: 'Start interview' })
      }

      options.push({ id: 'delete', name: 'Delete' })

      return <CompactMenu
        options={options}
        onChoice={c => handleCompactMenuChoice(c, row)}
        className={styles['project-interviews-table-control']}
        />
    }
  }
]);

const ProjectInterviewsTable = ({ className, data = [], onDelete, project, ...props }) => {
  const router = useRouter()

  const handleCompactMenuChoice = (c, rec) => {
    if (c.id == 'edit' || c.id == 'start') {
      router.push(`/interviews/${rec.id}/conduct/`)
    }

    if (c.id == 'delete') {
      onDelete(rec)
    }
  }

  return <Table rowKey={row => row.id} className={classNames(
    styles['project-interviews-table'],
    className
  )} columns={getColumns({ handleCompactMenuChoice, project,  sort: router.query.sort || '', order: router.query.order || ''  })} data={data} {...props} />
}

export default ProjectInterviewsTable;
