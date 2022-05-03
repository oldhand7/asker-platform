import BrandishButton from 'components/Button/BrandishButton';
import TextButton from 'components/Button/TextButton';
import classNames from 'classnames';
import TextInputField from 'components/TextInputField/TextInputField';
import TextareaInputField from 'components/TextareaInputField/TextareaInputField';
import useForm from 'libs/use-form';
import FlexRow from 'components/FlexRow/FlexRow'

import styles from './range-question-form.module.scss'

const rules =  {
  name: 'required',
  desc: 'max:140',
  min: 'required|numeric',
  max: 'required|numeric',
  unit: 'required',
  step: 'required|numeric'
}

const defaultVaues = {
  name: '',
  desc: '',
  min: '',
  max: '',
  unit: '',
  step: 1
}

const RangeQuestionForm = ({ values, className, onValues, onCancel, loading }) => {
  const [formValues, errors, control] = useForm({
    values: values ? { ...defaultVaues, ...values } : defaultVaues,
    rules
  })

  return <form data-test-id="range-question-form" onSubmit={control.submit(onValues)} className={classNames(styles['range-question-form'], className)}>
    <TextInputField error={errors && errors.name} className={styles['range-question-form-field']} onChange={control.input('name')} value={formValues.name} label="Title" name='name' placeholder="ex: do you have a driver’s licence?" />
    <TextareaInputField error={errors && errors.desc} className={styles['range-question-form-field']} onChange={control.input('desc')} value={formValues.desc} label="Description" name='desc' placeholder="Description" />

    <FlexRow>
      <TextInputField error={errors && errors.min} className={styles['range-question-form-field']} onChange={control.input('min')} value={formValues.min} label="Start value" name='min' placeholder="e.g 0"  />
      <TextInputField error={errors && errors.max} className={styles['range-question-form-field']} onChange={control.input('max')} value={formValues.max} label="End value" name='max' placeholder="e.g 10" />
    </FlexRow>

    <FlexRow>
      <TextInputField error={errors && errors.unit} className={styles['range-question-form-field']} onChange={control.input('unit')} value={formValues.unit} label="Unit value" name='unit' placeholder="years" />
      <TextInputField error={errors && errors.step} className={styles['range-question-form-field']} onChange={control.input('step')} value={formValues.step} label="Step" name='step' placeholder="1" />
    </FlexRow>

    <div className={styles['range-question-form-buttons']}>
    {
      !values.id ?
      <>
        <TextButton disabled={loading} className={styles['range-question-form-buttons-button']} type="button" onClick={onCancel}>Cancel</TextButton>
        <BrandishButton disabled={loading} className={styles['range-question-form-buttons-button']} type="submit">Create question</BrandishButton>
      </> :
      <>
        <BrandishButton disabled={loading} className={styles['range-question-form-buttons-button']} type="submit">Save question</BrandishButton>
      </>
    }
    </div>
  </form>
}

export default RangeQuestionForm;
