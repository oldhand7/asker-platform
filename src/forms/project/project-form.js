import FeatureList from 'components/FeatureList/FeatureList';
import classNames from 'classnames';
import useForm from 'libs/use-form';
import SearchWidget from 'components/SearchWidget/SearchWidget';
import Button from 'components/Button/PlatformButton';
import TextInputField from 'components/TextInputField/TextInputField'
import {useSite} from 'libs/site';
import ProjectFormStager from 'components/ProjectFormStager/ProjectFormStager';
import ProjectFormInterviewers from 'components/ProjectFormInterviewers/ProjectFormInterviewers';
import FeatureForm from 'components/FeatureForm/FeatureForm';
import { useState, useEffect } from 'react';

import styles from './project-form.module.scss';

const features = [
  { id: 'team-presentation', title: 'Team & role presentation', type: 'attraction' },
  { id: 'company-presentation', title: 'Company presentation', type: 'attraction' },
  { id: 'salary', title: 'Salary', type: 'attraction' },
  { id: 'candidate-questions', title: 'Candidate questions', type: 'attraction' },
  { id: 'competency-questions', title: 'Competency based questions', type: 'evaluation' },
  { id: 'motivation-questions', title: 'Motivation based questions', type: 'evaluation' },
  { id: 'screening-questions', title: 'Screening questions', type: 'evaluation' },
  { id: 'experience-questions', title: 'Experience based questions', type: 'evaluation' },
  { id: 'hard-skill-questions', title: 'Hard skill based questions', type: 'evaluation' },
  { id: 'culture-fit questions', title: 'Culture-fit based questions', type: 'evaluation' },
  { id: 'summary', title: 'Summary', type: 'other' },
  { id: 'others', title: 'Others', type: 'other' }
]

const ProjectFormSidebar = () => {
  return <div className={styles['project-form-sidebar']}>
      <div className={styles['project-form-sidebar-widget']}>
        <h3 className={styles['project-form-sidebar-widget-title']}>Attraction</h3>
        <FeatureList className={styles['project-form-sidebar-features']} features={features.filter(f => f.type == 'attraction')} />
      </div>

      <div className={styles['project-form-sidebar-widget']}>
        <h3 className={styles['project-form-sidebar-widget-title']}>Evaluation</h3>
        <FeatureList className={styles['project-form-sidebar-features']} features={features.filter(f => f.type == 'evaluation')} />
      </div>

      <div className={styles['project-form-sidebar-widget']}>
        <h3 className={styles['project-form-sidebar-widget-title']}>Other options</h3>
        <FeatureList className={styles['project-form-sidebar-features']} features={features.filter(f => f.type == 'other')} />
      </div>
    </div>
}

const defaultValues = {
  name: '',
  interviewers: [],
  stages: [
    { id: 'introduction', name: 'Introduction', type: 'other' },
    null,
    null
  ],
  config: {}
}

const rules = {
  name: 'required',
  interviewers: 'array|min:1',
  interviewers: 'array|min:1',
}

const ProjectForm = ({ className }) => {
  const [config, t] = useSite();
  const [stage, setStage] = useState(null);
  const [stageErrors, setStageErrors] = useState([]);

  const [values, errors, control] = useForm({
    values: defaultValues,
    rules
  })

  const handleInterviewerQuery = q => {
    //@TODO
  }

  const handleDeleteInterviewer = interviewer => {
    //@TODO
  }

  const handleStageValues = (stageValues) => {
    control.set('config', {
      ...values.config,
      [stage.id]: stageValues
    })

    setStageErrors([
      ...stageErrors.filter(error => error.stage.id != stage.id)
    ])
  }

  const onStageError = (error) => {
    setStageErrors([
      ...stageErrors.filter(error => error.stage.id != stage.id ),
      { stage, error }
    ])
  }

  const handleSubmit = (values) => {
    if (stageErrors) {
      setError(new Error('Some stages are invalid.'))

      return;
    }

    //@TODO: save data, redirect and show success message
  }

  return <form onSubmit={control.submit(handleSubmit)} className={classNames(styles['project-form'], className)}>
    <ProjectFormSidebar />

    <div className={styles['project-form-details']}>
      <div className={styles['project-form-details-inner']}>
        <h2 className={styles['project-form-title']}>Create a new project</h2>

        <TextInputField value={values.name} placeholder={t('Name')} error={errors ? t(errors.name) : null} onChange={control.input('name')} autoComplete='off' name='name' type='text' className={classNames(styles['project-form-field'], styles['project-form-field-name'])} />

        <div className={classNames(styles['project-form-field'], styles['project-form-field-stages'])}>
          <h3 className={styles['project-form-field-title']}>Interview Stages</h3>
          <ProjectFormStager onStageSelect={setStage} stages={values.stages} className={styles['project-form-stages']} onChange={control.input('stages', false)}  />
        </div>

        {stage ? <FeatureForm onError={onStageError} onValues={handleStageValues} feature={stage} /> : null}

        <div className={classNames(styles['project-form-field'], styles['project-form-field-interviewers'])}>
          <h3 className={styles['project-form-field-title']}>Assign interviewer</h3>

          <ProjectFormInterviewers className={styles['project-form-interviewers']} interviewers={values.interviewers} onChange={control.input('interviewers', false)} />
        </div>

        {
          stageErrors.length ?
          <div>
            <p>You can't save form, becouse some stages are invalid.</p>
            <ul>
              {stageErrors.map(({ stage, error}) => <li key={stage.id}>{stage.name}: {error.message}</li>)}
            </ul>
          </div> : null
        }

        <Button disabled={errors || stageErrors.length} type="submit" className={styles['project-form-submit']}>Create project</Button>
      </div>
    </div>
  </form>
}

export default ProjectForm;
