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
import { useUser } from 'libs/user';
import { useQueryStates, queryTypes } from 'next-usequerystate'

import styles from './TemplateTable.module.scss';

const getColumns = ({ handleCompactMenuChoice, sortOrder, setSortOrder, user, getAvatar }) => {
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
    title: <a href='#' onClick={handleSortOrder('templateName')}>
      Template name {getSortArrowIcon('templateName')}</a>,
    dataIndex: 'templateName',
    key: 'name',
  },
  {
    title: <a href='#' onClick={handleSortOrder('user.name')}>
      Created by {getSortArrowIcon('user.name')}</a>,
    dataIndex: 'user',
    key: 'user',
    render: (user) => (user && <UserCard title={user.name} avatar={user.avatar} />) || <NODATA />
  },
  {
    title: <a href='#' onClick={handleSortOrder('createdAt')}>
      Date created {getSortArrowIcon('createdAt')}</a>,
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: createdAt => {
      return dateFromTs(createdAt)
    }
  },
  {
    title: <a href='#' onClick={handleSortOrder('stagesCount')}>
      Interview stages {getSortArrowIcon('stagesCount')}</a>,
    dataIndex: 'stages',
    key: 'stages',
    render: (stages) => {
      return <Stager className={styles['template-table-stager']} stages={stages} />
    }
  },
  {
    title: <a href='#' onClick={handleDefaultSortOrder}><FilterIcon /></a>,
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

      return <CompactMenu className={styles['template-table-control']} options={options} onChoice={c => handleCompactMenuChoice(c, row)} />
    }
  }
]};

const TemplateTable = ({ className, data = [], onDelete, ...props }) => {
  const router = useRouter()
  const {user, getAvatar} = useUser()

  const [sortOrder, setSortOrder] = useQueryStates({
    sort: queryTypes.string.withDefault(router.query.sort || 'createdAt'),
    order: queryTypes.string.withDefault(router.query.order || 'desc')
  }, { history: 'push' })

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
    sortOrder,
    setSortOrder,
    user,
    getAvatar
  })} data={data} {...props} />
}

export default TemplateTable;
