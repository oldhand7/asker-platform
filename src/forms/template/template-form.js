import FeatureList from 'components/FeatureList/FeatureList';
import classNames from 'classnames';
import useForm from 'libs/use-form';
import Button from 'components/Button/PlatformButton';
import TextInputField from 'components/TextInputField/TextInputField'
import {useSite} from 'libs/site';
import ProjectFormStager from 'components/ProjectFormStager/ProjectFormStager';
import { useState, useEffect } from 'react';
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
import { ctxError } from 'libs/helper';
import FeatureForm from 'components/FeatureForm/FeatureForm';
import { calcDefaultScoringRules, packQuestions } from 'libs/project';

import styles from './template-form.module.scss';

const TemplateFormSidebar = () => {
  return <div className={styles['template-form-sidebar']}>
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
    { id: 'introduction', name: 'Introduction', type: 'other' },
    null,
    null
  ],
  scoringRules: null,
  stagesCount: 0,
  userId: null,
  companyId: null,
  config: {
    introduction: {
      text: ''
    }
  }
}

const rules = {
  templateName: 'required'
}

const messages = {
}

const TemplateForm = ({ template, className }) => {
  const [config, t] = useSite();
  const [stage, setStage] = useState(null);
  const [stageErrors, setStageErrors] = useState([]);
  const [error, setError] =  useState(null);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pristine, setPristine] = useState(true);

  const [values, errors, control] = useForm({
    values: template ? template : defaultValues,
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

    if (user.companyId != 'asker' && values.companyId == 'asker') {
      delete values.id;
    }

    values.userId = user.id;
    values.companyId = user.companyId;
    values.stagesCount = values.stages.filter(s => s).length;

    values.user = {
      id: user.id,
      name: user.name,
      avatar: user.images && user.images[0].src || null
    }

    if (!values.scoringRules) {
      values.scoringRules = calcDefaultScoringRules(values)
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

  return  <form data-test-id="template-form" onSubmit={control.submit(handleSubmit, handleSubmitFailure)} className={classNames(styles['template-form'], className)}>
    <TemplateFormSidebar />

    <div className={styles['template-form-details']}>
      <div className={styles['template-form-details-inner']}>
        <ProjectEvaluationCriteria project={values} onScoringRules={control.input('scoringRules', false)} className={styles['template-form-criteria']} />

        <h2 className={styles['template-form-title']}>
          {!template ? 'Create a new template' : 'Edit template'}
        </h2>

        <TextInputField value={values.templateName} placeholder={'Name'} error={errors ? errors.templateName : null} onChange={control.input('templateName')} autoComplete='off' name='templateName' type='text' className={classNames(styles['template-form-field'], styles['template-form-field-name'])} />

        <div className={classNames(styles['template-form-field'], styles['template-form-field-stages'])}>
          <h3 className={styles['template-form-field-title']}>Interview Stages</h3>

          <ProjectFormStager onStages={handleStages} activeStage={stage} onStageSelect={handleStageSelect} stages={values.stages} className={styles['template-form-stages']}  />

          <NewStageDroppable onStage={handleAddDropStage}>
          <div style={{ padding: '15rem 0'}}>
          {values.stages.length < 12 ? <button type="button" className={styles['template-form-add-stage']}onClick={() => addStage()}>Add stage +</button> : null}
          </div>
          </NewStageDroppable>

          {stage ?
          <div className={styles['template-form-stager-feature-form']} id="feature-form" data-test-id="feature-form">
            <FeatureForm values={stage && values.config[stage.id]} onError={onStageError} onValues={handleStageValues} feature={stage} />
          </div> : null}
        </div>

        {error ? <Alert type="error">{error.message}</Alert> : null}

        {
          !pristine && stageErrors.length ?
          <ErrorBox className={styles['template-form-stage-error-report']}>
            <p>You can't save form, because some stages are invalid:</p>
            <ul>
              {stageErrors.map(({ stage, error}) => <li key={stage.id}>{stage.name}</li>)}
            </ul>
          </ErrorBox> : null
        }

        <Button disabled={loading || errors} type="submit" className={styles['template-form-submit']}>{!loading ? (template ? 'Save template' : 'Create template') : 'Loading...'}</Button>
      </div>
    </div>
    {loading ? <Preloader /> : null}
  </form>
}

export default TemplateForm;
