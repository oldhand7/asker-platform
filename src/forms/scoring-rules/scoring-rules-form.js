import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import PlatformButton from 'components/Button/PlatformButton';
import Alert from 'components/Alert/Alert';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Table from 'rc-table';
import { validate } from 'libs/validator'
import { flattenCriteriaTree } from 'libs/criteria';
import { useForm } from 'libs/react-hook-form';
import { useTranslation } from 'libs/translation';

import styles from './scoring-rules-form.module.scss';
import { useWatch } from 'react-hook-form';

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

const ScoringRulesForm = ({ className, onValues, criteria = [], values }) => {
  const [error, setError] = useState(false);
  const [sumTotal, setSumTotal] = useState(null);
  const [criteriaNameMap, setCriteriaNameMap] = useState({});
  const { t, i18nField}= useTranslation();

  const initValues = useMemo(() => adjust(values, criteria), [])

  const {
    handleSubmit,
    setValue,
    control
  } = useForm({
    values: initValues,
  })

  const formValues = useWatch({ control, defaultValue: initValues })

  const onSubmit = (data) => {
    if (sumTotal == 100) {
      onValues(data)
    } else {
      setError(new Error(t('errors.total100')))
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

  const inputHandlers = useMemo(() => {
    const handlers = {}

    for (let i = 0; i < criteria.length; i++) {
      const { type, children } = criteria[i];

      if (!children) {
        handlers[type] = e => setValue(type, e.target.value)

        continue;
      }

      for (let k = 0; k < children.length; k++) {
        const { type } = children[k];

        handlers[type] = e => setValue(type, e.target.value)
      }
    }

    return handlers;
  }, [criteria, setValue])

  const columns = [
    {
      key: 'name',
      title: t('labels.name'),
      render: (_, key) => i18nField(criteriaNameMap[key]) || '?'
    },
    {
      key: 'weight',
      title: t('labels.weight')+' (%)',
      render: (_, key) => {
        const errors = validate(
          { value: formValues[key] },
          { value: 'required|numeric|min:0' }
        )

        return <TextInputField
          className={styles['scoring-rules-form-input']}
          value={formValues[key]}
          onChange={inputHandlers[key]}
          placeholder='%'
          error={errors && errors['value']} />
      }
    }
  ]

  useEffect(() => {
    if (sumTotal == 100) {
      setError(null)
    }
  }, [sumTotal])

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

  return <form data-test-id="scoring-rules-form" method="POST" noValidate className={classNames(styles['scoring-rules-form'], className)} onSubmit={handleSubmit(onSubmit)}>
    <h2 className={styles['scoring-rules-form-title']}>{t('headings.project-scoring-rules')}</h2>

    <p className="form-help">{t('help.total100')}</p>

    {error && <Alert type="error">{error.message}</Alert>}

    <Table rowKey={tagRow} className={styles['scoring-rules-table']} columns={columns} data={data} />

    <p className={styles['scoring-rules-form-total']}>
      <span>{t('labels.total')}: </span>
      {sumTotal !== null ? <span className={styles['scoring-rules-form-total-value']}>{sumTotal} %</span> : null}
    </p>

    <PlatformButton type="submit" className={styles['scoring-rules-form-submit']}>{t('actions.save')}</PlatformButton>
  </form>
}

export default ScoringRulesForm;
