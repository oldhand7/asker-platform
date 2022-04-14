import FeatureList from 'components/FeatureList/FeatureList';
import classNames from 'classnames';
import useForm from 'libs/use-form';
import Button from 'components/Button/PlatformButton';
import TextInputField from 'components/TextInputField/TextInputField'
import {useSite} from 'libs/site';
import ProjectFormStager from 'components/ProjectFormStager/ProjectFormStager';
import ProjectFormInterviewers from 'components/ProjectFormInterviewers/ProjectFormInterviewers';
import FeatureForm from 'components/FeatureForm/FeatureForm';
import { useState, useEffect } from 'react';
import { features, featureTypes } from 'libs/features';
import { addFlash } from 'libs/flash';
import Alert from 'components/Alert/Alert';
import { useUser } from 'libs/user';
import { saveProject } from 'libs/firestore'
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader'

import styles from './project-form.module.scss';

const ProjectFormSidebar = () => {
  return <div className={styles['project-form-sidebar']}>
      {featureTypes.map((featureType) => {
        const targetFeatures = features.filter(f => f.type == featureType.id)

        if (targetFeatures.length == 0) {
          return null;
        }

        return <div key={`feature-list-widget-${featureType.id}`} className={styles['project-form-sidebar-widget']}>
          <h3 className={styles['project-form-sidebar-widget-title']}>{featureType.name}</h3>
          <FeatureList className={styles['project-form-sidebar-features']} features={targetFeatures} />
        </div>
      })}
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
  userId: null,
  config: {
    introduction: {
      text: ''
    }
  },
  template: null,
  candidates: []
}

const rules = {
  name: 'required',
  interviewers: 'array|min:1'
}

const messages = {
  'min.interviewers': 'At least one interviewer is required.'
}

const ProjectForm = ({ project, className }) => {
  const [config, t] = useSite();
  const [stage, setStage] = useState(null);
  const [stageErrors, setStageErrors] = useState([]);
  const [error, setError] =  useState(null);
  const [user] = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [values, errors, control] = useForm({
    values: project ? project : defaultValues,
    rules,
    messages
  })

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
    if (stageErrors.length) {
      setError(new Error('Some stages are invalid.'))

      return;
    }

    values.userId = user.profile.uid;
    values.companyId = user.companyId;

    setLoading(true)

    saveProject(values)
      .then(() => {

        if (project) {
          addFlash('Project saved', 'success')
        } else {
          addFlash('Project created', 'success')
        }

        router.push('/projects/')
      })
      .catch(setError)
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  const handleStages = stages => {
    const stageValuesCopy = {
      ...values.config
    }

    const keys = Object.keys(values.config)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (!stages.find(stage => stage && key == stage.id)) {
        delete stageValuesCopy[key]
      }
    }

    control.setValues({
      ...values,
      stages,
      config: stageValuesCopy
    })
  }

  const addStage = () => {
    control.set('stages', [
      ...values.stages,
      null
    ])
  }

  useEffect(() => {
    setStage(null)
  }, [values.stages])

  const handleSubmitFailure = () => {
    if (errors) {
      let errorEl = document.querySelector('.form-error')

      if (!errorEl) {
        errorEl = document.querySelector('.alert')
      }

      if (errorEl) {
        errorEl.scrollIntoView({
          block: 'center'
        })
      }
    }
  }

  return  <form data-test-id="project-form" onSubmit={control.submit(handleSubmit, handleSubmitFailure)} className={classNames(styles['project-form'], className)}>
    <ProjectFormSidebar />

    <div className={styles['project-form-details']}>
      <div className={styles['project-form-details-inner']}>
        <h2 className={styles['project-form-title']}>Create a new project</h2>

        <TextInputField value={values.name} placeholder={t('Name')} error={errors ? t(errors.name) : null} onChange={control.input('name')} autoComplete='off' name='name' type='text' className={classNames(styles['project-form-field'], styles['project-form-field-name'])} />

        <div className={classNames(styles['project-form-field'], styles['project-form-field-stages'])}>
          <h3 className={styles['project-form-field-title']}>Interview Stages</h3>

          <ProjectFormStager onStages={handleStages} activeStage={stage} onStageSelect={setStage} stages={values.stages} className={styles['project-form-stages']}  />

          {values.stages.length < 12 ? <button type="button" className={styles['project-form-add-stage']}onClick={addStage}>Add stage +</button> : null}
        </div>

        {stage ? <FeatureForm values={values.config[stage.id]} onError={onStageError} onValues={handleStageValues}  feature={stage} /> : null}

        <div className={classNames(styles['project-form-field'], styles['project-form-field-interviewers'])}>
          <h3 className={styles['project-form-field-title']}>Assign interviewer</h3>

          <ProjectFormInterviewers className={styles['project-form-interviewers']} interviewers={values.interviewers} onChange={control.input('interviewers', false)} />

          {errors && errors['interviewers'] ? <p className="form-error">{errors['interviewers']}</p> : null}
        </div>

        {error ? <Alert type="error">{error.message}</Alert> : null}

        {
          stageErrors.length ?
          <div>
            <p>You can't save form, becouse some stages are invalid.</p>
            <ul>
              {stageErrors.map(({ stage, error}) => <li key={stage.id}>{stage.name}: {error.message}</li>)}
            </ul>
          </div> : null
        }

        <Button disabled={loading || errors || stageErrors.length} type="submit" className={styles['project-form-submit']}>{!loading ? (project ? 'Save project' : 'Create project') : 'Loading...'}</Button>
      </div>
    </div>
    {loading ? <Preloader /> : null}
  </form>
}

export default ProjectForm;
