import { Range, getTrackBackground } from 'react-range';
import TextInputField from 'components/TextInputField/TextInputField';
import useForm from 'libs/use-form'
import { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './salary-form.module.scss';

const MIN = 0;
const MAX = 9000;

const defaultValues = {
  currency: '€',
  range: [1000, 3000]
}

const rules = {
  currency: 'required',

}

const SalaryForm = ({ className, values, onValues }) => {
  const [formValues, errors, control] = useForm({
    values: values ? values : defaultValues,
    rules,
    pristine: false
  })

  useEffect(() => {
    if (!errors) {
      onValues(formValues)
    }
  }, [formValues, errors])

  return <div className={classNames(styles['salary-form'], className)}>
    <h3 className={styles['salary-form-title']}>Salary range</h3>

    <TextInputField error={errors && errors.currency} className={styles['salary-form-field']} onChange={control.input('currency')} name="currency" value={formValues.currency} />

    <div className={classNames(styles['salary-form-field'], styles['salary-form-slider'])}>
      <Range
        step={100}
        min={MIN}
        max={MAX}
        state={ { values: formValues.range }}
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
                  min: MIN,
                  max: MAX
                })

           }}
           className={styles['salary-form-slider-track']}
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
           className={styles['salary-form-slider-marker']}
         >
         <span className={styles['salary-form-slider-marker-value']}>{formValues.currency}{formValues.range[props.key]}</span></div>
       }}
        />
    </div>
  </div>
}

export default SalaryForm;
