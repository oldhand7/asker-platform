import FeatureList from 'components/FeatureList/FeatureList';
import classNames from 'classnames';
import { useForm } from 'libs/form';
import Button from 'components/Button/PlatformButton';
import TextInputField from 'components/TextInputField/TextInputField'
import ProjectFormStager from 'components/ProjectFormStager/ProjectFormStager';
import ProjectFormInterviewers from 'components/ProjectFormInterviewers/ProjectFormInterviewers';
import { useState, useEffect, useCallback } from 'react';
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
import { ctxError, getTimeLabel } from 'libs/helper';
import FeatureForm from 'components/FeatureForm/FeatureForm';
import { calcDefaultScoringRules, packQuestions, getProjectMinutes } from 'libs/project';
import TimeLabel from 'components/TimeLabel/TimeLabel';
import { validate } from 'libs/validator';
import { v4 as uuidv4 } from 'uuid';
import { getStageTime } from 'libs/stage'

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
    { id: 'introduction', name: 'Introduction', type: 'other', config: { html: '' }},
    null,
    null
  ],
  scoringRules: null,
  stagesCount: 0,
  userId: null,
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
  'min.interviewers': 'At least one interviewer is required.',
  'required.name': 'Name is required.'
}

const ProjectForm = ({ project, className }) => {
  const [stage, setStage] = useState(null);
  const [stageErrors, setStageErrors] = useState([]);
  const [error, setError] =  useState(null);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { values, errors, control, pristine, submitted } = useForm({
    values: project ? { ...defaultValues, ...project} : defaultValues,
    rules,
    messages
  })

  const handleStageValues = useCallback(stageValues => {
    const index = values.stages.indexOf(stage);

    if (index > -1) {
      values.stages[index].config = stageValues;

      control.set('stages', values.stages)
    }

    control.set('time', getProjectMinutes(values))

    setStageErrors([
      ...stageErrors.filter(error => error.stage.id != stage.id )
    ])
  }, [values.stages, stage])

  const onStageError = (error) => {
    setStageErrors([
      ...stageErrors.filter(error => error.stage.id != stage.id ),
      { stage, error }
    ])
  }

  const handleSubmit = (values, e) => {
    e.preventDefault();

    const errors = validate(values, rules, messages)

    if (errors) {
      setErrors(errors);

      return;
    }

    if (stageErrors.length) {
      setError(new Error('Some stages are invalid.'))

      return;
    }

    values.stages = values.stages
      .filter(s => s)
      .map(s => {
        if (!s.uid) {
          s.uid = uuidv4()
        }

        if (!s.time) {
          s.time = getStageTime(s);
        }

        return s;
      })


    values.userId = user.id;
    values.companyId = user.companyId;
    values.stagesCount = values.stages.filter(s => s).length;
    values.interviewersCount = values.interviewers.length;
    values.scoringRules = {
      ...calcDefaultScoringRules(values),
      ...(values.scoringRules || {})
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
        avatar: user.images && user.images[0].src || null
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

  const handleStages = useCallback((stages, _stage) => {
    control.set('stages', stages);
    
    if (_stage) {
      setStage(_stage)

      return;
    }

    if (stage) {
      const found = stages.find(s => s == stage)

      if (!found) {
        setStage(null);
      }
    }
  }, [values.stages])

  const addStage = (stage = null) => {
    const uniqueStage = JSON.parse(JSON.stringify(stage));

    const stages =  [
      ...values.stages,
      uniqueStage
    ]

    control.set('stages', stages);

    setStage(uniqueStage)
  }
  
  useEffect(() => {
    control.set('time', getProjectMinutes(values))
  }, [values.stages])

  const handleAddDropStage = (stage) => {
    addStage(stage)
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

  return  <form data-test-id="project-form" onSubmit={control.submit(handleSubmit)} className={classNames(styles['project-form'], className)}>
    { project && !project.id && project.template ?
        <p className={styles['project-form-template']}>Using template: <span>{project.template.name}</span></p>
        : null}

    <div className={styles['project-form-header']}>
      <TextInputField value={values.name} onChange={control.input('name')} placeholder={'Project name'} error={errors && errors.name}  autoComplete='off' name='name' type='text' className={styles['project-form-field-name']} />

      <div className={styles['project-form-header-control']}>
        <TimeLabel className={styles['project-form-total-time']}>{getTimeLabel(values.time)}</TimeLabel>
        <Button disabled={loading || errors} type="submit" className={styles['project-form-submit']}>
          {!loading ? (project ? 'Save project' : 'Create project') : 'Loading...'}</Button>
      </div>
    </div>

    <ProjectFormSidebar className={styles['project-form-sidebar']} />

    <div className={styles['project-form-details']}>
      <div className={styles['project-form-details-inner']}>


        {error ? <Alert type="error">{error.message}</Alert> : null}

        {
          submitted && stageErrors.length ?
          <ErrorBox className={styles['project-form-stage-error-report']}>
            <p>You can't save form, because some stages are invalid:</p>
            <ul>
              {stageErrors.map(({ stage, error}) => <li key={stage.id}>{stage.name}</li>)}
            </ul>
          </ErrorBox> : null
        }

        <ProjectEvaluationCriteria
          project={values}
          onScoringRules={sr => control.set('scoringRules', sr)} className={styles['project-form-criteria']} />

        <div className={styles['project-form-field-stages']}>
          <h3 className={styles['project-form-field-title']}>Interview Stages</h3>

          <ProjectFormStager onStages={handleStages} activeStage={stage} onStageSelect={setStage} stages={values.stages} className={styles['project-form-stager']}   />

          <NewStageDroppable onStage={handleAddDropStage}>
          <div>
          {values.stages.length < 14 ? <button type="button" className={styles['project-form-add-stage']} onClick={() => addStage()}>Add stage +</button> : null}
          </div>
          </NewStageDroppable>

          {stage ?
          <div className={styles['project-form-stager-feature-form']} id="feature-form" data-test-id="feature-form">
            <FeatureForm values={stage.config} onError={onStageError} onValues={handleStageValues} feature={stage} />
          </div> : null}
        </div>

        <div className={classNames(styles['project-form-field'], styles['project-form-field-interviewers'])}>
          <h3 className={styles['project-form-field-title']}>Assign interviewer</h3>

          <ProjectFormInterviewers className={styles['project-form-interviewers']} interviewers={values.interviewers} onChange={v => control.set('interviewers', v)} />

          {errors && errors['interviewers'] ? <p className="form-error">{errors['interviewers']}</p> : null}
        </div>

        {
        !values.template ?
        <CheckboxInputField checked={values.saveAsTemplate} className={styles['project-form-field']} onChange={control.toggle('saveAsTemplate')} label='Also save project as template' /> :
        null
        }

      </div>
    </div>
    {loading ? <Preloader /> : null}
  </form>
}

export default ProjectForm;
