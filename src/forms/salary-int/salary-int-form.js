import { Range, getTrackBackground } from 'react-range';
import {useForm} from 'libs/form'
import { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { handleNext } from 'libs/helper';
import NextButton from 'components/Button/NextButton';
import HtmlInputField from 'components/HtmlInputField/HtmlInputField';
import FlexRow from 'components/FlexRow/FlexRow';
import clasNames from 'classnames';

import styles from './salary-int-form.module.scss';

const defaultValues = {
  currency: '€',
  range: [0, 0],
  notes: ''
}

const rules = {

}

const SalaryIntForm = ({ last, nextId, className, values, markComplete, onValues, config }) => {
  const { values: formValues, errors, control, pristine } = useForm({
    values: values ? values : { ...defaultValues, range: [
      config.config ? config.config[0] : config.range[0],
      config.config ? config.config[1] : config.range[1]
    ]},
    rules
  })

  useEffect(() => {
    if (!errors) {
      onValues(formValues)
    }
  }, [formValues, errors])

  const background = useMemo(() => {
    const bgStart = formValues.range[0] * 100 / config.range[1];
    const bgEnd = formValues.range[1] * 100 / config.range[1];
    const projectMin = config.config[0] * 100 / config.range[1];
    const projectMax = config.config[1] * 100 / config.range[1];

    return `
    linear-gradient(
      to right,
      #B7B7B733 0%,
      #B7B7B733 ${Math.min(bgStart, projectMin)}%,
      #B7B7B733 ${projectMin}%,
      #43B88C ${projectMin}%,
      #43B88C ${projectMax}%,
      #E5C673 ${projectMax}%,
      #E5C673 ${Math.max(bgEnd, projectMax)}%,
      #E5C673 ${Math.max(bgEnd, projectMax)}%,
      #B7B7B733 ${projectMax}%,
      #B7B7B733 100%
      )
    `;
  }, [formValues])

  return <div className={classNames(styles['salary-int-form'], className)}>
    <h2 className={styles['salary-int-form-title']}>Salary</h2>

    <FlexRow className={styles['salary-int-form-flex-row']}>
      <div className={classNames(styles['salary-int-form-slider'])}>
        <span className={styles['salary-int-form-slider-min']}>{config.currency}{config.range[0]} -</span>
        <span className={styles['salary-int-form-slider-max']}>- {config.currency}{config.range[1]}</span>
        <Range
          step={100}
          min={config.range[0]}
          max={config.range[1]}
          state={ { range: formValues.range }}
          values={formValues.range}
          onChange={range => {
            control.set('range', range)
            markComplete()
          }}
          renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              background
            }}
            className={styles['salary-int-form-slider-track']}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => {
          return <div
            {...props}
            style={{
              ...props.style
            }}
            className={clasNames(
              styles['salary-int-form-slider-marker'],
              // props.key == 0 && formValues.range[0] < config.config[0] || formValues.range[0] > config.config[1]  ? styles['salary-int-form-slider-marker-outside'] : '',
              props.key == 1 && formValues.range[1] > config.config[1] ? styles['salary-int-form-slider-marker-outside'] : ''
            )}
          >
          <span className={styles['salary-int-form-slider-marker-value']}>{config.currency}{formValues.range[props.key]}</span></div>
        }}
          />
      </div>
      <div className={styles['salary-int-form-notes']}>
        <HtmlInputField className={styles['salary-int-form-notes-input']} value={formValues.notes || ''} onChange={control.input('notes', false)} placeholder='Notes about salary'  />
      </div>
    </FlexRow>

    {!last ? <NextButton onClick={() => {
      if (!pristine) {
        markComplete()
      }

      handleNext(nextId)
    }} className={styles['salary-int-form-next-button']} /> : null}
  </div>
}

export default SalaryIntForm;
