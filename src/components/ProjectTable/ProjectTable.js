import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectTableStatCell from 'components/ProjectTableStatCell/ProjectTableStatCell';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import FilterIcon from 'components/Icon/FilterIcon';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import Link from 'next/link';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';
import ArrowUpIcon from 'components/Icon/ArrowUpIcon';
import { useQueryStates, queryTypes } from 'next-usequerystate'

import styles from './ProjectTable.module.scss';

const getColumns = ({ handleCompactMenuChoice, sortOrder, setSortOrder }) => {
  const getSortArrowIcon = (name) => {
    return name == sortOrder.sort ? (sortOrder.order == 'asc' ? <ArrowUpIcon/> : <ArrowDownIcon/>) : '';
  }

  const handleSortOrder = name => {
    const newOrder =  {
      sort: name,
      order: sortOrder.sort == name ? (sortOrder.order == 'asc' ? 'desc' : 'asc') : 'asc'
    }

    return e => {
      e.preventDefault();
      setSortOrder(newOrder);
    }
  }

  const handleDefaultSortOrder = e => {
    e.preventDefault();
    setSortOrder({ sort: 'createdAt', order: 'desc' })
  }

  return [
  {
    title: <a href='#' onClick={handleSortOrder('name')}>
      Project name {getSortArrowIcon('name')}</a>,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: <a href='#' onClick={handleSortOrder('template.name')}>
      Template name {getSortArrowIcon('template.name')}</a>,
    dataIndex: 'template',
    key: 'template',
    render: (template) => (template && template.name) || <NODATA />
  },
  {
    title: <a href='#' onClick={handleSortOrder('interviewersCount')}>
      Interviewer name {getSortArrowIcon('interviewersCount')}</a>,
    dataIndex: 'interviewers',
    key: 'interviewers',
    render: (interviewers) => {
      return interviewers ? <div>
        {interviewers.map(i => <p key={i.id}>{i.name}</p>)}
      </div> : <NODATA />
    }
  },
  {
    title: <a href='#' onClick={handleSortOrder('stagesCount')}>
      Interview stages {getSortArrowIcon('stagesCount')}</a>,
    dataIndex: 'stages',
    key: 'stages',
    render: (stages) => {
      return <Stager className={styles['project-table-stager']} stages={stages} />
    }
  },
  {
    title: <a href='#' onClick={handleSortOrder('interviewsAwaitingCount')}>
      Interview status {getSortArrowIcon('interviewsAwaitingCount')}</a>,
    render: (candidates, project) => {
      return <ProjectTableStatCell project={project} />
    }
  },
  {
    title: <a href='#' onClick={handleDefaultSortOrder}><FilterIcon /></a>,
    render: (_, row) => {
      const options = [
        { id: 'overview', name: 'Interviews' },
        { id: 'edit', name: 'Edit' }
      ]

      if (row.companyId != 'asker') {
        options.push({
          id: 'delete',
          name: 'Delete'
        })
      }

      return <CompactMenu className={styles['project-table-control']} options={options} onChoice={c => handleCompactMenuChoice(c, row)} />
    }
  }
]};

const ProjectTable = ({ className, data = [], onDelete, ...props }) => {
  const router = useRouter()

  const [sortOrder, setSortOrder] = useQueryStates({
    sort: queryTypes.string.withDefault(router.query.sort || 'createdAt'),
    order: queryTypes.string.withDefault(router.query.order || 'desc')
  }, { history: 'push' })

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'edit') {
      router.push(`/projects/${row.id}/edit/`)
    }

    if (c.id == 'overview') {
      router.push(`/projects/${row.id}/overview/`)
    }

    if (c.id == 'delete' && onDelete) {
      onDelete(row)
    }
  }

  const tagRow = (row) => {
    return {
      onClick: () => router.push(`/projects/${row.id}/overview/`)
    }
  }

  return <Table onRow={tagRow} rowKey={row => row.id} className={classNames(
    styles['project-table'],
    className
  )} columns={getColumns({ handleCompactMenuChoice, sortOrder, setSortOrder })} data={data} {...props} />
}

export default ProjectTable;
