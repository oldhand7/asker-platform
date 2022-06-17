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
    title: <Link href={getSortLink('updatedAt', sort, order, project)}>
      <a>Date of interview {getSortArrowIcon('updatedAt', sort, order)}</a>
    </Link>,
    dataIndex: 'updatedAt',
    render: (updatedAt, row) => {
      if (typeof row.score === 'undefined') {
        return <PlatformButton className={styles['project-interviews-table-start-button']} href={`/interviews/${row.id}/conduct`}>
          <PlayIcon /> Start interview</PlatformButton>
      }

      return dateFromTs(updatedAt)
    }
  },
  {
    title: <a href={`/projects/${project.id}/overview/`}>
      Actions <FilterIcon />
    </a>,
    render: (_, row) => {
      return <div className={styles['project-interviews-table-actions']}>
        {row.score !== 'undefined' ? <EditButton onClick={e => handleAction('edit', row, e)} /> : null}
        <TrashButton onClick={e => handleAction('delete', row, e)} />
      </div>
    }
  }
]);

const ProjectInterviewsTable = ({ className, data = [], onDelete, project, ...props }) => {
  const [rowOpen, setRowOpen] = useState(null);

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

  const handleRowSelect = (row, index) => {
    setRowOpen(row == rowOpen ? null : row)
  }
  const rowExtra = interview => {
    if (interview != rowOpen) return ;

    const interviewEvaluations = []

    const aggregate = getInterviewAggregate(interview);

    for (const key in aggregate) {
      if (key == 'competency' || key == 'experience' || key == 'hard-skill') {
        for (const cid in aggregate[key]) {
          const score = aggregate[key][cid].reduce(sumReducer, 0);

          if (!score) {
            continue;
          }

          const { criteria } = aggregate[key][cid][0];

          interviewEvaluations.push({
            id: cid,
            name: criteria.name,
            score: Math.round(score / aggregate[key][cid].length),
            type: criteria.type
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

    return <InterviewDetails className={styles['project-interviews-table-details']} interview={interview}>
        <div className={styles['project-interviews-table-evaluations']}>
            {interviewEvaluations.length ? interviewEvaluations.map((e, index) => (
                <EvaluationScore
                  key={index}
                  evaluation={e}
                  className={styles['project-interviews-table-evaluations-evaluation']} />
              )) : <NODATA /> }
        </div>
    </InterviewDetails>
  }

  return <FlexTable
    rowKey={row => row.id}
    rowExtra={rowExtra}
    sizes={['25%', '25%', '25%', '25%']}
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
