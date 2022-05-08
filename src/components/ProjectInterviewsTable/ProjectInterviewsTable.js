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
import { getSubtype } from 'libs/helper';

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
    render: (stages, interview) => {
      if (typeof interview.score === 'undefined') {
        return <PlatformButton href={`/interviews/${interview.id}/conduct`}>
          <PlayIcon /> Start interview</PlatformButton>
      }


      if (!stages) {
        return <NODATA />
      }

      const scoredEvaluations = Object.values(stages).map(stage => Object.values(stage).filter(eva => eva.score))

      const isCriteriaQuestion = e => {
        const subtype = getSubtype(e);
        return EVALUATION_SUBTYPES_NO_CRITERIA.indexOf(subtype) == -1;
      }

      let evasWithCriterias = [];
      let evasWithoutCriterias = [];

      for (let i = 0; i < scoredEvaluations.length; i++) {
        evasWithCriterias = [
          ...evasWithCriterias,
          ...scoredEvaluations[i].filter(e => isCriteriaQuestion(e))
        ]

        evasWithoutCriterias = [
          ...evasWithoutCriterias,
          ...scoredEvaluations[i].filter(e => !isCriteriaQuestion(e))
        ]
      }

      const evasWithoutCriteriasReduced = Object.values(evasWithoutCriterias.reduce((evas, e) => {
        const subtype = getSubtype(e);

        if (!evas[subtype]) {
          evas[subtype] = { ...e }
        } else {
          evas[subtype].score = Math.round((evas[subtype].score + e.score) / 2)
        }

        return evas;
      }, {}))

      let evas = [
        ...evasWithCriterias,
        ...evasWithoutCriteriasReduced
      ]

      evas.sort(function(a, b) {
        const sa = a.score / a.maxScore;
        const sb = b.score / b.maxScore;

        if (sa < sb) return -1;
        if (sa > sb) return 1;

        return 0;
      });

      return <div className={styles['project-interviews-table-evaluations']}>
          {evas.reverse().map((e, index) => <EvaluationScore key={e.criteria && e.criteria.id || e.subtype} evaluation={e} className={styles['project-interviews-table-evaluations-evaluation']} />)}
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
