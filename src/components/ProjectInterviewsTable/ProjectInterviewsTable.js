import Table from 'rc-table';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import InterviewScore from 'components/InterviewScore/InterviewScore';
import PlatformButton from 'components/Button/PlatformButton';
import PlayIcon from 'components/Icon/PlayIcon';
import EvaluationScore from 'components/EvaluationScore/EvaluationScore';
import FilterIcon from 'components/Icon/FilterIcon';
import Link from 'next/link';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';
import ArrowUpIcon from 'components/Icon/ArrowUpIcon';
import { EVALUATION_SUBTYPES_NO_CRITERIA } from 'libs/config';
import { getSubtype, ucFirst } from 'libs/helper';
import { getInterviewAggregate } from 'libs/interview';
import FlexTable from 'components/FlexTable/FlexTable';
import { useState } from 'react';
import InterviewDetails from 'components/InterviewDetails/InterviewDetails';
import { dateFromTs} from 'libs/helper';
import TrashButton from 'components/TrashButton/TrashButton';
import EditButton from 'components/EditButton/EditButton';
import { scoreMap } from 'libs/scoring'
import InterviewDetailsRowScreening from 'components/InterviewDetailsRow/InterviewDetailsRowScreening';
import InterviewDetailsRowEvaluation from 'components/InterviewDetailsRow/InterviewDetailsRowEvaluation';
import { getStageKey } from 'libs/stage';
import Tooltip from 'components/Tooltip/Tooltip';

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

const getColumns = ({ handleAction, project, sort, order }) => ([
  {
    title: <Link href={getSortLink('candidate.name', sort, order, project)}>
      <a>Candidate {getSortArrowIcon('candidate.name', sort, order)}</a>
    </Link>,
    dataIndex: 'name',
    render: (_, row) => <span className={styles['project-interviews-table-col-name']}>
    {row.candidate.name}</span>
  },
  {
    title: <Link href={getSortLink('score', sort, order, project)}>
      <a>Total interview score {getSortArrowIcon('score', sort, order)}</a>
    </Link>,
    dataIndex: 'score',
    key: 'score',
    render: (score) => {
      return <InterviewScore className={styles['project-interviews-table-col-score']} score={score || 0} />;
    }
  },
  {
    title: <Link href={getSortLink('updatedAt', sort, order, project)}>
      <a>Date of interview {getSortArrowIcon('updatedAt', sort, order)}</a>
    </Link>,
    dataIndex: 'updatedAt',
    render: (updatedAt, row) => {
      if (typeof row.score === 'undefined') {
        return <PlatformButton className={styles['project-interviews-table-start-button']} onClick={e => {
          e.stopPropagation();
          window.location = `/interviews/${row.id}/conduct`
        }}>
          <PlayIcon /> Start interview</PlatformButton>
      }

      return <span className={styles['project-interviews-table-col-date']}>
        {dateFromTs(updatedAt)}</span>
    }
  },
  {
    title: <a href={`/projects/${project.id}/overview/`}>
      Actions <FilterIcon />
    </a>,
    render: (_, row) => {
      return <div className={styles['project-interviews-table-actions']}>
        {typeof row.score !== 'undefined' ? <Tooltip text='Edit response'><EditButton onClick={e => handleAction('edit', row, e)} /></Tooltip> : null}
        <Tooltip text='Delete candidate'><TrashButton onClick={e => handleAction('delete', row, e)} /></Tooltip>
      </div>
    }
  }
]);

const ProjectInterviewsTable = ({ className, data = [], onDelete, project, ...props }) => {
  const [rowsOpen, setRowsOpen] = useState([]);

  const router = useRouter()

  const handleAction = (action, rec, e) => {
    e.stopPropagation();

    if (action == 'edit') {
      router.push(`/interviews/${rec.id}/conduct/`)
    }

    if (action == 'delete') {
      onDelete(rec)
    }
  }

  const columns = getColumns({
    handleAction, project,
    sort: router.query.sort || '', order: router.query.order || ''
  })

  const handleRowSelect = (interview, index) => {
    const exist = rowsOpen.indexOf(interview) > -1 ;

    if (exist) {
      setRowsOpen([
        ...rowsOpen.filter(r => r != interview)
      ])
    } else {
      setRowsOpen([
        ...rowsOpen,
        interview
      ])
    }
  }
  const rowExtra = interview => {
    if (rowsOpen.indexOf(interview) == -1) return;

    const table = scoreMap(interview, project)

    const otherQuestions = {
        'screening-questions': [],
        'other-questions': []
    };

    for (let i = 0; i < project.stages.length; i++) {
      if (['screening-questions', 'other-questions'].indexOf(project.stages[i].id) == -1) {
        continue;
      }

      const key = getStageKey(project.stages[i])

      if (interview.evaluations && interview.evaluations[key]) {

        for (const qid in interview.evaluations[key]) {
          const { config } = project.stages[i];

          const question = config.questions.find(q => q.id == qid)

          if (question) {
            otherQuestions[project.stages[i].id].push({
              question: question,
              answer: interview.evaluations[key][qid]
            })
          }
        }
      }
    }


    return <InterviewDetails className={styles['project-interviews-table-details']} interview={interview}>
        {
          table['competency'].score ?
          <InterviewDetailsRowEvaluation evaluation={table['competency']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          otherQuestions['screening-questions'].length ?
        <InterviewDetailsRowScreening evaluations={otherQuestions['screening-questions']} className={styles['project-interviews-table-details-row']} /> :
        null
      }

        {
          table['hard-skill'].score ?
          <InterviewDetailsRowEvaluation evaluation={table['hard-skill']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          table['motivation'].score ?
          <InterviewDetailsRowEvaluation evaluation={table['motivation']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          table['culture-fit'].score ?
          <InterviewDetailsRowEvaluation evaluation={table['culture-fit']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          table['experience'].score ?
          <InterviewDetailsRowEvaluation evaluation={table['experience']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          otherQuestions['other-questions'].length ?
        <InterviewDetailsRowScreening other={true} evaluations={otherQuestions['other-questions']} className={styles['project-interviews-table-details-row']} /> :
        null
      }
    </InterviewDetails>
  }

  return <FlexTable
    rowKey={row => row.id}
    rowExtra={rowExtra}
    sizes={['30', '25%', '25%', '20%']}
    className={classNames(
      styles['project-interviews-table'],
      className
    )}
    columns={columns}
    data={data}
    onRow={handleRowSelect}
    {...props} />
}

export default ProjectInterviewsTable;
