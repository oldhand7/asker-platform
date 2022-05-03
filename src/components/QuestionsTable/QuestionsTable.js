import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import NODATA from 'components/NODATA/NODATA';
import { criteriaTypes } from 'libs/criteria';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import FilterIcon from 'components/Icon/FilterIcon';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';
import ArrowUpIcon from 'components/Icon/ArrowUpIcon';
import Link from 'next/link';
import { useUser } from 'libs/user';
import { useRouter } from 'next/router';

import styles from './QuestionsTable.module.scss';

const getSortLink = (name, sort, order) => {
  return `?sort=${name}&order=${sort == name ? (order == 'asc' ? 'desc' : 'asc') : 'asc'}`
}

const getSortArrowIcon = (name, sort, order) => {
  return name == sort ? (order == 'asc' ? <ArrowUpIcon/> : <ArrowDownIcon/>) : '';
}

const getColumns = ({ handleCompactMenuChoice, sort, order, user }) => ([
  {
    title: <Link href={getSortLink('type', sort, order)}>
      <a>Type of question {getSortArrowIcon('type', sort, order)}</a>
    </Link>,
    key: 'type',
    render: (_, row) => {
      if (row.type == 'evaluation') {
        const ct = criteriaTypes.find(c => c.id == row.subtype)

        if (!ct) {
          return <NODATA />
        }

        return ct.name
      }

      if (row.type == 'screening') {
        const subtype = getScreeningQuestionLabelBySubtype(row.subtype);

        return <>Screening<br/><small>{subtype}</small></>
      }

      if (row.type == 'other') {
        const subtype = getScreeningQuestionLabelBySubtype(row.subtype);

        return <>Other<br/><small>{subtype}</small></>
      }

      return <NODATA />
    }
  },
  {
    title: <Link href={getSortLink('criteria.name', sort, order)}>
      <a>Criterion {getSortArrowIcon('criteria.name', sort, order)}</a>
    </Link>,
    key: 'criteria',
    render: (_, { criteria }) => {
      return criteria ? criteria.name : <NODATA />
    }
  },
  {
    title: <Link href={getSortLink('name', sort, order)}>
      <a>Question {getSortArrowIcon('name', sort, order)}</a>
    </Link>,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: <Link href={getSortLink('followupCount', sort, order)}>
      <a>Follow up questions  {getSortArrowIcon('followupCount', sort, order)}</a>
    </Link>,
    dataIndex: 'followup',
    key: 'followup',
    render: (questions) => questions && questions.length ? <ul className={styles['questions-table-followup-questions']}>
      {questions.map((q, index) => <li className={styles['questions-table-followup-questions-question']} key={`q${index}`}>{q}</li>)}
    </ul> : <NODATA />
  },
  {
    title: <Link href="?sort=createdAt&order=desc"><a><FilterIcon /></a></Link>,
    key: 'action',
    render: (_, row) => {
      const options = [
        { id: 'edit', name: user && user.companyId == row.companyId ? 'Edit' : 'Edit copy' }
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

const QuestionsTable = ({ className, data = [], onDelete, ...props }) => {
  const router = useRouter()
  const {user} = useUser()

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'edit') {
      router.push(`/questions/${row.id}/edit/`)
    }

    if (c.id == 'delete') {
      onDelete(row)
    }
  }

  const tagRow = (rec) => {
    return {
      'data-company-id': rec.companyId
    }
  }

  return <Table onRow={tagRow} rowKey={row => row.id} className={classNames(
    styles['questions-table'],
    className
  )} columns={getColumns({
    handleCompactMenuChoice,
    sort: router.query.sort || 'createdAt',
    order: router.query.order || 'desc',
    user
  })} data={data} {...props} />
}

export default QuestionsTable;
