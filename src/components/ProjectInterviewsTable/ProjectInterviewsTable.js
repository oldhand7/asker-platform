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
import { features } from 'libs/features';

import styles from './ProjectInterviewsTable.module.scss';

const getSortLink = (name, sort, order, project) => {
  return `/projects/${project.id}/overview/?sort=${name}&order=${sort == name ? (order == 'asc' ? 'desc' : 'asc') : 'asc'}`
}

const getSortArrowIcon = (name, sort, order) => {
  return name == sort ? (order == 'asc' ? <ArrowUpIcon/> : <ArrowDownIcon/>) : '';
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

      const criterias = {}

      const stageKeys = Object.keys(evaluations).filter(sk => {
        //Leave out stages without criteria
        return features.find(f => f.id == sk && f.metadata && f.metadata.criteria )
      })

      for (let i = 0; i < stageKeys.length; i++) {
        const key = stageKeys[i];

        const qEvaluations = Object.values(evaluations[key])

        for (let n = 0; n < qEvaluations.length; n++) {
          const qEval = qEvaluations[n];

          const id = qEval.criteria && qEval.criteria.id;
          const key = id || qEval.subtype

          if (!criterias[key]) {
            criterias[key] = {
              id: key,
              name: id ? qEval.criteria.name : ucFirst(qEval.subtype),
              score: qEval.score
            }
          } else {
            criterias[key].score += qEval.score
            criterias[key].score /= 2
          }
        }
      }

      const finalEvaluations = Object.values(criterias)

      finalEvaluations.sort(function(a, b) {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;

        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        return 0;
      });

      return <div className={styles['project-interviews-table-evaluations']}>
          {
            finalEvaluations.length ? finalEvaluations.map((e, index) => <EvaluationScore key={index} evaluation={e} className={styles['project-interviews-table-evaluations-evaluation']} />) :
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
