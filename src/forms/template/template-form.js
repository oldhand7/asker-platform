import FeatureList from 'components/FeatureList/FeatureList';
import classNames from 'classnames';
import { useForm } from 'libs/form';
import Button from 'components/Button/PlatformButton';
import TextInputField from 'components/TextInputField/TextInputField'
import ProjectFormStager from 'components/ProjectFormStager/ProjectFormStager';
import { useState, useEffect, useCallback } from 'react';
import { features, featureTypes } from 'libs/features';
import { addFlash } from 'libs/flash';
import Alert from 'components/Alert/Alert';
import { useUser } from 'libs/user';
import { saveCollectionDocument } from 'libs/firestore'
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader'
import NewStageDroppable from 'components/NewStageDroppable/NewStageDroppable'
import ProjectEvaluationCriteria from 'components/ProjectEvaluationCriteria/ProjectEvaluationCriteria';
import ErrorBox from 'components/ErrorBox/ErrorBox';
import { ctxError, getTimeLabel } from 'libs/helper';
import FeatureForm from 'components/FeatureForm/FeatureForm';
import { calcDefaultScoringRules, packQuestions, getProjectMinutes } from 'libs/project';
import TimeLabel from 'components/TimeLabel/TimeLabel';
import { validate } from 'libs/validator';
import { v4 as uuidv4 } from 'uuid';
import { getStageTime } from 'libs/stage'

import styles from './template-form.module.scss';

const TemplateFormSidebar = ({ className }) => {
  return <div className={classNames(styles['project-form-sidebar'], className)}>
      {featureTypes.map((featureType) => {
        const targetFeatures = features.filter(f => f.type == featureType.id)

        if (targetFeatures.length == 0) {
          return null;
        }

        return <div key={`feature-list-widget-${featureType.id}`} className={styles['template-form-sidebar-widget']}>
          <h3 className={styles['template-form-sidebar-widget-title']}>{featureType.name}</h3>
          <FeatureList className={styles['template-form-sidebar-features']} features={targetFeatures} />
        </div>
      })}
    </div>
}

const defaultValues = {
  name: '',
  templateName: '',
  stages: [
    { id: 'introduction', name: 'Introduction', type: 'other', config: { html: '' }},
    null,
    null
  ],
  scoringRules: null,
  stagesCount: 0,
  userId: null,
  companyId: null
}

const rules = {
  templateName: 'required',
}

const messages = {
  'required.templateName': 'Template name is required.'
}

const TemplateForm = ({ template, className }) => {
  const [stage, setStage] = useState(null);
  const [stageErrors, setStageErrors] = useState([]);
  const [error, setError] =  useState(null);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { values, errors, control, pristine, submitted } = useForm({
    values: template ? template : defaultValues,
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

    if (user.companyId != 'asker' && values.companyId == 'asker') {
      delete values.id;
    }

    values.userId = user.id;
    values.companyId = user.companyId;
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
    values.stagesCount = values.stages.length;
    values.scoringRules = {
      ...calcDefaultScoringRules(values),
      ...(values.scoringRules || {})
    }
    values.user = {
      id: user.id,
      name: user.name,
      avatar: user.images && user.images[0].src || null
    }

    packQuestions(values);

    setLoading(true)

    saveCollectionDocument('templates', values)
      .then(() => {
        if (template) {
          addFlash('Template saved', 'success')
        } else {
          addFlash('Template created', 'success')
        }

        router.push('/templates/')
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

  return  <form data-test-id="template-form" onSubmit={control.submit(handleSubmit)} className={classNames(styles['template-form'], className)}>
    <div className={styles['template-form-header']}>
      <TextInputField value={values.templateName} onChange={control.input('templateName')} placeholder={'Template name'} error={errors && errors.templateName}  autoComplete='off' name='templateName' type='text' className={styles['template-form-field-name']} />
      <div className={styles['template-form-header-control']}>
        <TimeLabel className={styles['template-form-total-time']}>{getTimeLabel(values.time)}</TimeLabel>
        <Button disabled={loading || errors} type="submit" className={styles['template-form-submit']}>
          {!loading ? (template ? 'Save template' : 'Create template') : 'Loading...'}</Button>
      </div>
    </div>

    <TemplateFormSidebar className={styles['template-form-sidebar']} />

    <div className={styles['template-form-details']}>
      <div className={styles['template-form-details-inner']}>
        {error ? <Alert type="error">{error.message}</Alert> : null}

        {
          submitted && stageErrors.length ?
          <ErrorBox className={styles['template-form-stage-error-report']}>
            <p>You can't save form, because some stages are invalid:</p>
            <ul>
              {stageErrors.map(({ stage, error}) => <li key={stage.id}>{stage.name}</li>)}
            </ul>
          </ErrorBox> : null
        }

        <ProjectEvaluationCriteria
          project={values}
          onScoringRules={sr => control.set('scoringRules', sr)} className={styles['template-form-criteria']} />

        <div className={styles['template-form-field-stages']}>
          <h3 className={styles['template-form-field-title']}>Interview Stages</h3>

          <ProjectFormStager onStages={handleStages} activeStage={stage} onStageSelect={setStage} stages={values.stages} className={styles['template-form-stager']}   />

          <NewStageDroppable onStage={handleAddDropStage}>
          <div>
          {values.stages.length < 14 ? <button type="button" className={styles['template-form-add-stage']} onClick={() => addStage()}>Add stage +</button> : null}
          </div>
          </NewStageDroppable>
        </div>

        {stage ?
          <div data-stage-id={stage.id} className={styles['template-form-feature-form']} id="feature-form" data-test-id="feature-form">
            <FeatureForm values={stage.config} onError={onStageError} onValues={handleStageValues} feature={stage} />
          </div> : null}
      </div>
    </div>
    {loading ? <Preloader /> : null}
  </form>
}

export default TemplateForm;
