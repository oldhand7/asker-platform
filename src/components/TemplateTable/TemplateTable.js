import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import FilterIcon from 'components/Icon/FilterIcon';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import { dateFromTs, ctxError } from 'libs/helper';
import UserCard from 'components/UserCard/UserCard';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';
import ArrowUpIcon from 'components/Icon/ArrowUpIcon';
import Link from 'next/link';
import { useUser } from 'libs/user';

import styles from './TemplateTable.module.scss';

const getSortLink = (name, sort, order) => {
  return `?sort=${name}&order=${sort == name ? (order == 'asc' ? 'desc' : 'asc') : 'asc'}`
}

const getSortArrowIcon = (name, sort, order) => {
  return name == sort ? (order == 'asc' ? <ArrowUpIcon/> : <ArrowDownIcon/>) : '';
}

const getColumns = ({ handleCompactMenuChoice, sort, order, user }) => ([
  {
    title: <Link href={getSortLink('templateName', sort, order)}>
      <a>Template name {getSortArrowIcon('templateName', sort, order)}</a>
    </Link>,
    dataIndex: 'templateName',
    key: 'name',
  },
  {
    title: <Link href={getSortLink('user.name', sort, order)}>
      <a>Created by {getSortArrowIcon('user.name', sort, order)}</a>
    </Link>,
    dataIndex: 'user',
    key: 'user',
    render: (user) => (user && <UserCard title={user.name} />) || <NODATA />
  },
  {
    title: <Link href={getSortLink('createdAt', sort, order)}>
      <a>Date created {getSortArrowIcon('createdAt', sort, order)}</a>
    </Link>,
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: createdAt => {
      return dateFromTs(createdAt)
    }
  },
  {
    title: <Link href={getSortLink('stagesCount', sort, order)}>
      <a>Interview stages {getSortArrowIcon('stagesCount', sort, order)}</a>
    </Link>,
    dataIndex: 'stages',
    key: 'stages',
    render: (stages) => {
      return <Stager className={styles['template-table-stager']} stages={stages} />
    }
  },
  {
    title: <Link href="?sort=createdAt&order=desc"><a><FilterIcon /></a></Link>,
    render: (_, row) => {
      const options = [
        { id: 'edit', name: user && user.companyId == row.companyId ? 'Edit' : 'Edit copy' },
        { id: 'create-project', name: 'Create project' }
      ]

      if (user && user.companyId == row.companyId) {
        options.push({
          id: 'delete',
          name: 'Delete'
        })
      }

      return <CompactMenu options={options} onChoice={c => handleCompactMenuChoice(c, row)} />
    }
  }
]);

const TemplateTable = ({ className, data = [], onDelete, ...props }) => {
  const router = useRouter()
  const {user} = useUser()

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

  const tagRow = (rec) => {
    return {
      'data-company-id': rec.companyId,
      onClick: () => router.push(`/templates/${rec.id}/edit/`)
    }
  }

  return <Table onRow={tagRow} rowKey={row => row.id} className={classNames(
    styles['template-table'],
    className
  )} columns={getColumns({
    handleCompactMenuChoice,
    sort: router.query.sort || 'createdAt',
    order: router.query.order || 'desc',
    user
  })} data={data} {...props} />
}

export default TemplateTable;
