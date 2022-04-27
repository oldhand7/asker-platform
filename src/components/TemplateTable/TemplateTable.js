import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import FilterIcon from 'components/Icon/FilterIcon';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import { dateFromTs, ctxError } from 'libs/helper';
import UserCard from 'components/UserCard/UserCard';

import styles from './TemplateTable.module.scss';

const getColumns = ({ handleCompactMenuChoice }) => ([
  {
    title: 'Template name',
    dataIndex: 'templateName',
    key: 'name',
  },
  {
    title: 'Created by',
    dataIndex: 'user',
    key: 'user',
    render: (user) => (user && <UserCard title={user.name} />) || <NODATA />
  },
  {
    title: 'Date created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: createdAt => {
      return dateFromTs(createdAt)
    }
  },
  {
    title: 'Interview stages',
    dataIndex: 'stages',
    key: 'stages',
    render: (stages) => {
      return <Stager className={styles['template-table-stager']} stages={stages} />
    }
  },
  {
    title: <FilterIcon />,
    render: (_, row) => {
      const options = [
        { id: 'edit', name: 'Edit' },
        { id: 'create-project', name: 'Create project' }
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

import demoProjects from 'data/demo/projects.json';

const TemplateTable = ({ className, data = demoProjects, onDelete, ...props }) => {
  const router = useRouter()

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'edit') {
      router.push(`/templates/${row.id}/edit/`)
    }

    if (c.id == 'create-project') {
      router.push(`/projects/create/?template=${row.id}`)
    }
    if (c.id == 'delete' && onDelete) {
      onDelete(row)
    }
  }

  return <Table rowKey={row => row.id} className={classNames(
    styles['template-table'],
    className
  )} columns={getColumns({ handleCompactMenuChoice })} data={data} {...props} />
}

export default TemplateTable;
