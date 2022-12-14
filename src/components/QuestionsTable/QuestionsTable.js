import Table from 'rc-table';
import classNames from 'classnames';
import NODATA from 'components/NODATA/NODATA';
import { criteriaTypes } from 'libs/criteria';
import CompactMenu from 'components/CompactMenu/CompactMenu';
import FilterIcon from 'components/Icon/FilterIcon';
import { getScreeningQuestionLabelBySubtype } from 'forms/screening-question/screening-question-form';
import ArrowDownIcon from 'components/Icon/ArrowDownIcon';
import ArrowUpIcon from 'components/Icon/ArrowUpIcon';
import { useUser } from 'libs/user';
import { useRouter } from 'next/router';
import { useQueryStates, queryTypes } from 'next-usequerystate'
import { useTranslation } from 'libs/translation';

import styles from './QuestionsTable.module.scss';

const getColumns = ({ handleCompactMenuChoice, sortOrder, setSortOrder, user, t, locale, i18nField }) => {
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
    title: <a href='#' onClick={handleSortOrder('type')}>
      {t('headings.question-type')} {getSortArrowIcon('type')}</a>,
    key: 'type',
    render: (_, row) => {
      if (row.type == 'evaluation') {
        const ct = criteriaTypes.find(c => c.id == row.subtype)

        if (!ct) {
          return <NODATA />
        }
        
        return t(`labels.${row.subtype}`)
      }

      if (row.type == 'screening') {
        const subtype = getScreeningQuestionLabelBySubtype(row.subtype, t);

        return <>{t('labels.screening')}<br/><small>{subtype}</small></>
      }

      if (row.type == 'other') {
        const subtype = getScreeningQuestionLabelBySubtype(row.subtype, t);

        return <>{t('labels.other')}<br/><small>{subtype}</small></>
      }

      return <NODATA />
    }
  },
  {
    title: <a href='#' onClick={handleSortOrder(`criteria.name.${locale}`)}>
      {t('labels.criterion')} {getSortArrowIcon(`criteria.name.${locale}`)}</a>,
    key: 'criteria',
    render: (_, { criteria }) => {
      return criteria && i18nField(criteria.name) || <NODATA />
    }
  },
  {
    title: <a href='#' onClick={handleSortOrder('name')}>
      {t('labels.question')} {getSortArrowIcon('name')}</a>,
    dataIndex: 'name',
    key: 'name',
    render: (name) => <div className={styles['questions-table-expand']}>{i18nField(name)}</div>
  },
  {
    title: <a href='#' onClick={handleSortOrder('followupCount')}>
      {t('headings.followup-questions')} {getSortArrowIcon('followupCount')}</a>,
    dataIndex: 'followup',
    key: 'followup',
    render: (questions) => questions && questions.length ? <ul className={styles['questions-table-followup-questions']}>
      {questions.map((q, index) => <li className={styles['questions-table-followup-questions-question']} key={`q${index}`}>{i18nField(q)}</li>)}
    </ul> : <NODATA />
  },
  {
    title: <a href='#' onClick={handleDefaultSortOrder}><FilterIcon /></a>,
    key: 'action',
    render: (_, row) => {
      const options = [
        { id: 'edit', name: user && user.companyId == row.companyId ? t('actions.edit') : t('actions.edit-copy') }
      ]

      if (user && user.companyId == row.companyId) {
        options.push({
          id: 'delete',
          name: t('actions.delete')
        })
      }

      return <CompactMenu className={styles['questions-table-control']} options={options} onChoice={c => handleCompactMenuChoice(c, row)} />
    }
  }
]};

const QuestionsTable = ({ className, data = [], onDelete, ...props }) => {
  const router = useRouter()
  const { user } = useUser()
  const { locale } = useRouter();
  const { t, i18nField } = useTranslation()

  const [sortOrder, setSortOrder] = useQueryStates({
    sort: queryTypes.string.withDefault(router.query.sort || 'createdAt'),
    order: queryTypes.string.withDefault(router.query.order || 'desc')
  }, { history: 'push' })

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
      'data-company-id': rec.companyId,
      onClick: () => router.push(`/questions/${rec.id}/edit/`)
    }
  }

  return <Table onRow={tagRow} rowKey={row => row.id} className={classNames(
    styles['questions-table'],
    className
  )} columns={getColumns({
    handleCompactMenuChoice,
    sortOrder,
    setSortOrder,
    user,
    t,
    locale,
    i18nField
  })} data={data} {...props} />
}

export default QuestionsTable;
