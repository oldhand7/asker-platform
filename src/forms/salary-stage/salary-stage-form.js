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
  range: [0, 9000],
  config: [1000, 3000]
}

const rules = {
  range: 'range'
}

const SalaryStageForm = ({ className, values, onValues, onError }) => {
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
    const v = Number.parseInt(ev.target.value || 0);

    control.setValues({
      ...formValues,
      range: [v, formValues.range[1]],
      config: [v, formValues.range[1]]
    })
  }

  const handleMax = ev => {
    const v = Number.parseInt(ev.target.value || 0);

    control.setValues({
      ...formValues,
      range: [formValues.range[0], v],
      config: [formValues.range[0], v]
    })
  }

  useEffect(() => {
    if (errors) {
      onError(new Error('Min max values incorrect or '))
    }
  }, [errors])

  const handleChange = (vals) => {
    control.input('config', false)
  }

  return <div className={classNames(styles['salary-stage-form'], className)}>
    <h3 className={styles['salary-stage-form-title']}>Salary range</h3>

    <FlexRow>
      <TextInputField label='Absolute min' className={styles['salary-stage-form-field']} onChange={handleMin} name="min" value={formValues.range[0]} />
      <TextInputField label='Absolute max' className={styles['salary-stage-form-field']} onChange={handleMax} name="max" value={formValues.range[1]} />
    </FlexRow>


    <TextInputField label='Currency' error={errors && errors.currency} className={styles['salary-stage-form-field']} onChange={control.input('currency')} name="currency" value={formValues.currency} />

        <div className={classNames(styles['salary-stage-form-field'], styles['salary-stage-form-slider'])}>
        <div className={styles['salary-stage-form-slider-info']}>
          <h4 >Position boundry</h4>
          <p className="form-help">Choose tolerable min/max values for this position.</p>
        </div>

      {!errors || !errors.range ?  <Range
            step={100}
            min={formValues.range[0]}
            max={formValues.range[1]}
            allowOverlap={false}
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
             <span className={styles['salary-stage-form-slider-marker-value']}>{formValues.currency}{formValues.config[props.key] || 0}</span></div>
           }}
            /> : null}
            {errors && errors.range ? <p className="form-error">
            <small>{errors.range}</small>
            </p> : null}
        </div>
  </div>
}
export default SalaryStageForm;
