import { Range, getTrackBackground } from 'react-range';
import TextInputField from 'components/TextInputField/TextInputField';
import useForm from 'libs/use-form'
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { handleNext } from 'libs/helper';
import NextButton from 'components/Button/NextButton';

import styles from './salary-int-form.module.scss';

const MIN = 0;
const MAX = 9000;

const defaultValues = {
  currency: '€',
  range: [0, 0]
}

const rules = {

}

const SalaryIntForm = ({ last, nextId, className, values, onValues, config }) => {
  const [formValues, errors, control] = useForm({
    values: values ? values : { ...defaultValues, range: [config.range[0], config.range[1]]},
    rules,
    pristine: false
  })

  useEffect(() => {
    if (!errors) {
      onValues(formValues)
    }
  }, [formValues, errors])

  return <div className={classNames(styles['salary-int-form'], className)}>
    <h2 className={styles['salary-int-form-title']}>Salary</h2>

    <div className={classNames(styles['salary-int-form-field'], styles['salary-int-form-slider'])}>
      <span className={styles['salary-int-form-slider-min']}>{config.currency}{config.range[0]} -</span>
      <span className={styles['salary-int-form-slider-max']}>- {config.currency}{config.range[1]}</span>
      <Range
        step={100}
        min={config.range[0]}
        max={config.range[1]}
        state={ { range: formValues.range }}
        values={formValues.range}
        onChange={control.input('range', false)}
        renderTrack={({ props, children }) => (
         <div
           {...props}
           style={{
             ...props.style,
             background: getTrackBackground({
                  values: formValues.range,
                  colors: ['#B7B7B733', '#43B88C', '#B7B7B733'],
                  min: config.range[0],
                  max: config.range[1]
                })

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
           className={styles['salary-int-form-slider-marker']}
         >
         <span className={styles['salary-int-form-slider-marker-value']}>{config.currency}{formValues.range[props.key]}</span></div>
       }}
        />
    </div>
    {!last ? <NextButton onClick={() => handleNext(nextId)} className={styles['salary-int-form-next-button']} /> : null}
  </div>
}

export default SalaryIntForm;
