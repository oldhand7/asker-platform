import FeatureList from 'components/FeatureList/FeatureList';
import classNames from 'classnames';
import useForm from 'libs/use-form';
import Button from 'components/Button/PlatformButton';
import TextInputField from 'components/TextInputField/TextInputField'
import ProjectFormStager from 'components/ProjectFormStager/ProjectFormStager';
import ProjectFormInterviewers from 'components/ProjectFormInterviewers/ProjectFormInterviewers';
import { useState, useEffect } from 'react';
import { features, featureTypes } from 'libs/features';
import { addFlash } from 'libs/flash';
import Alert from 'components/Alert/Alert';
import { useUser } from 'libs/user';
import { saveCollectionDocument } from 'libs/firestore'
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader'
import NewStageDroppable from 'components/NewStageDroppable/NewStageDroppable'
import CheckboxInputField from 'components/CheckboxInputField/CheckboxInputField';
import ProjectEvaluationCriteria from 'components/ProjectEvaluationCriteria/ProjectEvaluationCriteria';
import ErrorBox from 'components/ErrorBox/ErrorBox';
import { ctxError} from 'libs/helper';
import FeatureForm from 'components/FeatureForm/FeatureForm';
import { calcDefaultScoringRules, packQuestions } from 'libs/project';

import styles from './project-form.module.scss';

const ProjectFormSidebar = ({ className }) => {
  return <div className={classNames(styles['project-form-sidebar'], className)}>
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
  interviewersCount: 0,
  stages: [
    { id: 'introduction', name: 'Introduction', type: 'other' },
    null,
    null
  ],
  scoringRules: null,
  stagesCount: 0,
  userId: null,
  config: {
    introduction: {
      text: ''
    }
  },
  template: null,
  interviewsCount: 0,
  interviewsAwaitingCount: 0,
  saveAsTemplate: false
}

const rules = {
  name: 'required',
  interviewers: 'array|min:1'
}

const messages = {
  'min.interviewers': 'At least one interviewer is required.'
}

const ProjectForm = ({ project, className }) => {
  const [stage, setStage] = useState(null);
  const [stageErrors, setStageErrors] = useState([]);
  const [error, setError] =  useState(null);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pristine, setPristine] = useState(true);

  const [values, errors, control] = useForm({
    values: project ? { ...defaultValues, ...project} : defaultValues,
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
      setPristine(false);

      return;
    }

    setPristine(false);

    if (stageErrors.length) {
      setError(new Error('Some stages are invalid.'))

      return;
    }

    values.userId = user.id;
    values.companyId = user.companyId;
    values.stagesCount = values.stages.filter(s => s).length;
    values.interviewersCount = values.interviewers.length;

    if (!values.scoringRules) {
      values.scoringRules = calcDefaultScoringRules(values)
    }

    //Cleanup old stages
    for (let key in (values.config || {})) {
      const s = values.stages.find(s => s.id == key)

      if (!s) {
        delete values.config[key]
      }
    }

    packQuestions(values);

    const tasks = []

    if (values.saveAsTemplate) {
      delete values.saveAsTemplate;

      const copy = JSON.parse(JSON.stringify(values));

      delete copy.interviewers;

      copy.templateName = copy.name;
      copy.name = '';

      copy.user = {
        id: user.id,
        name: user.name,
      }

      tasks.push(saveCollectionDocument('templates', copy))
      tasks.push(saveCollectionDocument('projects', values))
    } else {
      delete values.saveAsTemplate;

      tasks.push(saveCollectionDocument('projects', values))
    }

    setLoading(true)

    Promise.all(tasks)
      .then(() => {
        if (project) {
          addFlash('Project saved', 'success')
        } else {
          addFlash('Project created', 'success')
        }

        router.push('/projects/')
      })
      .catch(error => {
        setError(ctxError('Server error', error))
      })
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  const handleStages = (stages, newStage = null) => {
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

    if (newStage) {
      setStage(newStage)
    }
  }

  const addStage = (stage = null) => {
    control.set('stages', [
      ...values.stages,
      stage
    ])
  }

  useEffect(() => {
    if (stage && values.stages.indexOf(stage) === -1) {
      setStage(null)
    }
  }, [stage, values.stages])

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

  const handleStageSelect = (st) => {
    if (stage == st) {
      setStage(null);
    } else {
      setStage(st);
    }
  }

  const handleAddDropStage = (stage) => {
    addStage(stage)
    setStage(stage)
  }

  useEffect(() => {
    if (stage) {
      const el = document.querySelector('#feature-form')

      if (el) {
        el.scrollIntoView({
          block: 'center',
          behavior: 'smooth'
        })
      }
    }
  }, [stage])

  return  <form data-test-id="project-form" onSubmit={control.submit(handleSubmit, handleSubmitFailure)} className={classNames(styles['project-form'], className)}>
    <ProjectFormSidebar className={styles['project-form-sidebar']} />

    <div className={styles['project-form-details']}>
      <div className={styles['project-form-details-inner']}>
        <ProjectEvaluationCriteria project={values} onScoringRules={control.input('scoringRules', false)} className={styles['project-form-criteria']} />

        <h2 className={styles['project-form-title']}>Create a new project</h2>

        { project && !project.id && project.template ?
        <h2 className={styles['project-form-template']}>Template: {project.template.name}</h2>
        : null}

        <TextInputField value={values.name} placeholder={'Name'} error={errors ? errors.name : null} onChange={control.input('name')} autoComplete='off' name='name' type='text' className={classNames(styles['project-form-field'], styles['project-form-field-name'])} />

        <div className={classNames(styles['project-form-field'], styles['project-form-field-stages'])}>
          <h3 className={styles['project-form-field-title']}>Interview Stages</h3>

          <ProjectFormStager  onStages={handleStages} activeStage={stage} onStageSelect={handleStageSelect} stages={values.stages} className={styles['project-form-stages']}  />

          <NewStageDroppable onStage={handleAddDropStage}>
          <div style={{ padding: '15rem 0'}}>
          {values.stages.length < 12 ? <button type="button" className={styles['project-form-add-stage']}onClick={() => addStage()}>Add stage +</button> : null}
          </div>
          </NewStageDroppable>

          {stage ?
          <div className={styles['project-form-stager-feature-form']} id="feature-form" data-test-id="feature-form">
            <FeatureForm values={stage && values.config[stage.id]} onError={onStageError} onValues={handleStageValues} feature={stage} />
          </div> : null}
        </div>

        <div className={classNames(styles['project-form-field'], styles['project-form-field-interviewers'])}>
          <h3 className={styles['project-form-field-title']}>Assign interviewer</h3>

          <ProjectFormInterviewers className={styles['project-form-interviewers']} interviewers={values.interviewers} onChange={control.input('interviewers', false)} />

          {errors && errors['interviewers'] ? <p className="form-error">{errors['interviewers']}</p> : null}
        </div>

        {error ? <Alert type="error">{error.message}</Alert> : null}

        {
        !values.template ?
        <CheckboxInputField checked={values.saveAsTemplate} className={styles['project-form-field']} onChange={control.toggle('saveAsTemplate')} label='Also save project as template' /> :
        null
        }

        {
          !pristine && stageErrors.length ?
          <ErrorBox className={styles['project-form-stage-error-report']}>
            <p>You can't save form, because some stages are invalid:</p>
            <ul>
              {stageErrors.map(({ stage, error}) => <li key={stage.id}>{stage.name}</li>)}
            </ul>
          </ErrorBox> : null
        }

        <Button disabled={loading || errors} type="submit" className={styles['project-form-submit']}>{!loading ? (project ? 'Save project' : 'Create project') : 'Loading...'}</Button>
      </div>
    </div>
    {loading ? <Preloader /> : null}
  </form>
}

export default ProjectForm;
