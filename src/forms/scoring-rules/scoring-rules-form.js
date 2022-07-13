import useForm from 'libs/use-form';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import Alert from 'components/Alert/Alert';
import { useState, useEffect, useMemo } from 'react';
import { ctxError } from 'libs/helper';
import Table from 'rc-table';
import { validate } from 'libs/validator'
import { flattenCriteriaTree } from 'libs/criteria';

import styles from './scoring-rules-form.module.scss';

const adjust = (values, criteria) => {
  const criteriaMap = flattenCriteriaTree(criteria || [])

  const oldCriteriaMap = values || {}

  for (let key in oldCriteriaMap) {
    if (!criteriaMap[key]) {
      delete oldCriteriaMap[key]
    }
  }

  return Object.assign(criteriaMap, oldCriteriaMap)
}

const ScoringRulesForm = ({ className, onValues, criteria = [], values, type }) => {
  const [formValues, errors, control] = useForm({ values: adjust(values, criteria) })
  const [error, setError] = useState(false);
  const [sumTotal, setSumTotal] = useState(null);
  const [criteriaNameMap, setCriteriaNameMap] = useState({});

  const handleSubmit = () => {
    if (sumTotal == 100) {
      onValues(formValues)
    } else {
      setError(new Error('Your total does not equal 100%'))
    }
  }

  useEffect(() => {
    const objects = Object.values(formValues);
    const sum = objects.reduce((sum, x) => sum + Number.parseFloat(x), 0)

    setSumTotal(Math.round(sum));
  }, [formValues])

  useEffect(() => {
    setCriteriaNameMap(flattenCriteriaTree(criteria, 'name'))
  }, [criteria])

  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (_, key) => criteriaNameMap[key] ? criteriaNameMap[key] : '?'
    },
    {
      key: 'weight',
      title: 'Weight (%)',
      render: (_, key) => {
        const errors = validate({ value: formValues[key] }, { value: 'required|numeric|min:0' })
        return <TextInputField
          className={styles['scoring-rules-form-input']}
          value={formValues[key]} onChange={control.input(key)} placeholder='%' error={errors && errors['value']} />
      }
    }
  ]

  const data = useMemo(() => {
    const data = Object.keys(formValues)

    data.sort(function (a, b) {
        if (a > b) {
            return 1;
        }

        if (b > a) {
            return -1;
        }
        return 0;
    });

    return data
  }, [formValues])

  const tagRow = rec => rec

  return <form data-test-id="scoring-rules-form" method="POST" noValidate className={classNames(styles['scoring-rules-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <h2 className={styles['scoring-rules-form-title']}>Project scoring rules</h2>

    <p className="form-help">Your total must equal 100%</p>

    <Table rowKey={tagRow} className={styles['scoring-rules-table']} columns={columns} data={data} />


    <p className={styles['scoring-rules-form-total']}>
      <span>Current total: </span>
      {sumTotal !== null ? <span className={styles['scoring-rules-form-total-value']}>{sumTotal} %</span> : null}
    </p>

    {error ? <Alert type="error">{error.message}</Alert> : null}

    <PlatformButton type="submit" className={styles['scoring-rules-form-submit']}>Save</PlatformButton>
  </form>
}

export default ScoringRulesForm;
