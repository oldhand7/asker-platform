import classNames from 'classnames';
import { useRouter } from 'next/router';
import InterviewScore from 'components/InterviewScore/InterviewScore';
import PlatformButton from 'components/Button/PlatformButton';
import PlayIcon from 'components/Icon/PlayIcon';
import FilterIcon from 'components/Icon/FilterIcon';
import Link from 'next/link';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';
import ArrowUpIcon from 'components/Icon/ArrowUpIcon';
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
import CompareButton from 'components/CompareButton/CompareButton';

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

const getColumns = ({ handleAction, compare = [],  project, sort, order, t, onEditCandidate, anonimize = false }) => ([
  {
    title: <Link href={getSortLink('candidate.name', sort, order, project)}>
      <a>Candidate {getSortArrowIcon('candidate.name', sort, order)}</a>
    </Link>,
    dataIndex: 'name',
    render: (_, row) => <div className={styles['project-interviews-table-col-name']}>
    {!anonimize ? row.candidate.name : row.candidate.alias} <EditButton onClick={() => onEditCandidate(row)} className={styles['project-interviews-table-col-name-edit']} />
    </div>
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
      if (row.status == 'awaiting') {
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

        {row.status != 'awaiting' ? <>
        <Tooltip text='Compare candidate'>{setRef => (
          <CompareButton active={compare.indexOf(row) > -1} ref={setRef} onClick={e => handleAction('compare', row, e)} />)}
        </Tooltip>
        <Tooltip text='Edit response'>{setRef => (
          <EditButton ref={setRef} onClick={e => handleAction('edit', row, e)} />)}
        </Tooltip></> : null}
        <Tooltip text='Delete candidate'>{setRef => (
          <TrashButton ref={setRef} onClick={e => handleAction('delete', row, e)} />)}</Tooltip>
      </div>
    }
  }
]);

const ProjectInterviewsTable = ({ className, data = [], onEditCandidate, onDelete, compare, onCompare, project, ...props }) => {
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

    if (action == 'compare') {
      onCompare(rec)
    }
  }

  const columns = getColumns({
    handleAction, project,
    sort: router.query.sort || '', order: router.query.order || '',
    compare,
    onEditCandidate,
    anonimize: project.anonimize
  })

  const handleRowSelect = (row, index) => {
    const exist = rowsOpen.indexOf(row) > -1 ;

    if (exist) {
      setRowsOpen([
        ...rowsOpen.filter(r => r != row)
      ])
    } else {
      setRowsOpen([
        ...rowsOpen,
        row
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
          table['competency'].children.length  ?
          <InterviewDetailsRowEvaluation evaluation={table['competency']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          otherQuestions['screening-questions'].length ?
        <InterviewDetailsRowScreening evaluations={otherQuestions['screening-questions']} className={styles['project-interviews-table-details-row']} /> :
        null
      }

        {
          table['hard-skill'].children.length ?
          <InterviewDetailsRowEvaluation evaluation={table['hard-skill']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          table['motivation'].score ?
          <InterviewDetailsRowEvaluation evaluation={table['motivation']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          table['culture'].score ?
          <InterviewDetailsRowEvaluation evaluation={table['culture']} className={styles['project-interviews-table-details-row']} /> :
          null
        }

        {
          table['experience'].children.length ?
          <InterviewDetailsRowEvaluation evaluation={table['experience']} className={styles['project-interviews-table-details-row']} /> :
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
