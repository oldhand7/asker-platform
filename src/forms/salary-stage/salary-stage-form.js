import { Range, getTrackBackground } from 'react-range';
import TextInputField from 'components/TextInputField/TextInputField';
import useForm from 'libs/use-form'
import { useEffect } from 'react';
import classNames from 'classnames';
import FlexRow from 'components/FlexRow/FlexRow';

import styles from './salary-stage-form.module.scss';

const MIN = 0;
const MAX = 1000000;

const defaultValues = {
  currency: '€',
  range: [1000, 9000],
  config: [1000, 3000]
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

  const handleMin = ev => {
    control.setValues({
      ...formValues,
      range: [ev.target.value, formValues.range[1]],
      config: [ev.target.value, formValues.config[1]]
    })
  }

  const handleMax = ev => {
    control.setValues({
      ...formValues,
      range: [formValues.range[0], ev.target.value],
      config: [formValues.config[0], ev.target.value]
    })
  }


  return <div className={classNames(styles['salary-stage-form'], className)}>
    <h3 className={styles['salary-stage-form-title']}>Salary range</h3>

    <div className={classNames(styles['salary-stage-form-field'], styles['salary-stage-form-slider'])}>
      <Range
        step={100}
        min={formValues.range[0]}
        max={formValues.range[1]}
        allowOverlap={true}
        state={ { values: formValues.config }}
        values={formValues.config}
        onChange={control.input('config', false)}
        renderTrack={({ props, children }) => (
         <div
           {...props}
           style={{
             ...props.style,
             background: getTrackBackground({
                  values: formValues.config,
                  colors: ['#B7B7B733', '#43B88C', '#B7B7B733'],
                  min: formValues.range[0],
                  max: formValues.range[1]
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
         <span className={styles['salary-stage-form-slider-marker-value']}>{formValues.currency}{formValues.config[props.key]}</span></div>
       }}
        />
    </div>

    <FlexRow>
      <TextInputField label='Min' error={errors && errors.currency} className={styles['salary-stage-form-field']} onChange={handleMin} name="min" value={formValues.range[0]} />
      <TextInputField label='Max' error={errors && errors.currency} className={styles['salary-stage-form-field']} onChange={handleMax} name="max" value={formValues.range[1]} />
    </FlexRow>

    <TextInputField label='Currency' error={errors && errors.currency} className={styles['salary-stage-form-field']} onChange={control.input('currency')} name="currency" value={formValues.currency} />
  </div>
}
export default SalaryStageForm;
