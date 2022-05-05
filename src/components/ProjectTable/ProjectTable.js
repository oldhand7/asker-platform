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

import styles from './ProjectTable.module.scss';

const getSortLink = (name, sort, order) => {
  return `?sort=${name}&order=${sort == name ? (order == 'asc' ? 'desc' : 'asc') : 'asc'}`
}

const getSortArrowIcon = (name, sort, order) => {
  return name == sort ? (order == 'asc' ? <ArrowUpIcon/> : <ArrowDownIcon/>) : '';
}

const getColumns = ({ handleCompactMenuChoice, onSort, sort, order }) => ([
  {
    title: <Link href={getSortLink('name', sort, order)}>
      <a>Project name {getSortArrowIcon('name', sort, order)}</a>
    </Link>,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: <Link href={getSortLink('template.name', sort, order)}>
      <a>Template name {getSortArrowIcon('template.name', sort, order)}</a>
    </Link>,
    dataIndex: 'template',
    key: 'template',
    render: (template) => (template && template.name) || <NODATA />
  },
  {
    title: <Link href={getSortLink('interviewersCount', sort, order)}>
      <a>Interviewer name {getSortArrowIcon('interviewersCount', sort, order)}</a>
    </Link>,
    dataIndex: 'interviewers',
    key: 'interviewers',
    render: (interviewers) => {
      return interviewers ? <div>
        {interviewers.map(i => <p key={i.id}>{i.name}</p>)}
      </div> : <NODATA />
    }
  },
  {
    title: <Link href={getSortLink('stagesCount', sort, order)}>
      <a>Interview stages {getSortArrowIcon('stagesCount', sort, order)}</a>
    </Link>,
    dataIndex: 'stages',
    key: 'stages',
    render: (stages) => {
      return <Stager className={styles['project-table-stager']} stages={stages} />
    }
  },
  {
    title: <Link href={getSortLink('interviewsAwaitingCount', sort, order)}>
      <a>Interview status {getSortArrowIcon('interviewsAwaitingCount', sort, order)}</a>
    </Link>,
    render: (candidates, project) => {
      return <ProjectTableStatCell project={project} />
    }
  },
  {
    title: <Link href="?sort=createdAt&order=desc"><a><FilterIcon /></a></Link>,
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

      return <CompactMenu options={options} onChoice={c => handleCompactMenuChoice(c, row)} />
    }
  }
]);

const ProjectTable = ({ className, data = [], onDelete, ...props }) => {
  const router = useRouter()

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
  )} columns={getColumns({ handleCompactMenuChoice, sort: router.query.sort || 'createdAt', order: router.query.order || 'desc' })} data={data} {...props} />
}

export default ProjectTable;
