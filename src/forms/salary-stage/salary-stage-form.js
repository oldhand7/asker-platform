import { Range, getTrackBackground } from 'react-range';
import TextInputField from 'components/TextInputField/TextInputField';
import useForm from 'libs/use-form'
import { useEffect } from 'react';
import classNames from 'classnames';

import styles from './salary-stage-form.module.scss';

const MIN = 0;
const MAX = 9000;

const defaultValues = {
  currency: '€',
  range: [1000, 3000]
}

const rules = {
  currency: 'required',

}

const SalaryStageForm = ({ className, values, onValues }) => {
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

  return <div className={classNames(styles['salary-stage-form'], className)}>
    <h3 className={styles['salary-stage-form-title']}>Salary range</h3>

    <div className={classNames(styles['salary-stage-form-field'], styles['salary-stage-form-slider'])}>
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
           className={styles['salary-stage-form-slider-track']}
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
           className={styles['salary-stage-form-slider-marker']}
         >
         <span className={styles['salary-stage-form-slider-marker-value']}>{formValues.currency}{formValues.range[props.key]}</span></div>
       }}
        />
    </div>

    <TextInputField label='Currency' error={errors && errors.currency} className={styles['salary-stage-form-field']} onChange={control.input('currency')} name="currency" value={formValues.currency} />
  </div>
}

export default SalaryStageForm;
