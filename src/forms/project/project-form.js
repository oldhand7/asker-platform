import classNames from 'classnames';
import { useForm } from 'libs/react-hook-form';
import Button from 'components/Button/PlatformButton';
import TextInputField from 'components/TextInputField/TextInputField'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { addFlash } from 'libs/flash';
import Alert from 'components/Alert/Alert';
import { useUser } from 'libs/user';
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader'
import ProjectEvaluationCriteria from 'components/ProjectEvaluationCriteria/ProjectEvaluationCriteria';
import { ctxError } from 'libs/helper';
import FeatureForm from 'components/FeatureForm/FeatureForm';
import { calcDefaultScoringRules, packQuestions, calcProjectTime, configureStages } from 'libs/project';
import TimeLabel from 'components/TimeLabel/TimeLabel';
import { v4 as uuidv4 } from 'uuid';
import { getStageKey } from 'libs/stage';
import ProjectFormProcess from 'components/ProjectFormProcess/ProjectFormProcess';
import InterviewerSelect from 'components/InterviewerSelect/InterviewerSelect';
import { checkScoringRulesValid } from 'libs/project';
import { getFeatureById } from 'libs/features';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useDocumentsApi } from 'libs/db';
import { useTranslation } from 'libs/translation';
import { validate } from 'libs/validator';
import FocusPopup from 'components/FocusPopup/FocusPopup';
import ProjectSaveAsTemplatePopup from 'components/ProjectSaveAsTemplatePopup/ProjectSaveAsTemplatePopup';

import styles from './project-form.module.scss';

const defaultValues = {
  name: '',
  interviewers: [],
  stages: [
    { ...getFeatureById('introduction'), uid: uuidv4() }
  ],
  config: {},
  interviewers: [],
  scoringRules: null,
  stagesCount: 0,
  time: 0,
  userId: null,
  user: null,
  template: null,
  saveAsTemplate: false,
  anonimize: false
}

const ProjectForm = ({ record, className, context = 'project', test = 0 }) => {
  const [error, setError] =  useState(null);
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true);
  const docsApi = useDocumentsApi();
  const stageErrors = useRef({});
  const [stageErrorsLive, setStageErrorsLive] = useState({})
  const [popup, setPopup] = useState(false);

  const validationRules = useMemo(() => {
    const rules = {
      name: 'required'
    }

    if (context == 'project') {
      rules.interviewers = 'required|array|min:1'
    }

    return rules;
  }, [context]);

  const validationMessages = useMemo(() => ({
    'required': t('errors.field.required')
  }), [router.locale])

  const initValue = useMemo(() => record || defaultValues, [])

  const {
    errors,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitted }
  } = useForm({
    values: initValue,
    rules: validationRules,
    messages: validationMessages
  })

  const {
    fields: formStages,
    ...stagesApi
  } = useFieldArray({ control, name: 'stages',  keyName: '_id' })
  const formValues  = useWatch({ control, defaultValue: initValue })
  const formConfig  = useWatch({ control, name: 'config', defaultValue: initValue.config })

  const [stage, setStage] = useState(null);

  useEffect(() => {
    setValue('time', calcProjectTime(formValues))
  }, [formStages, formConfig, setValue])

  useEffect(() => {
    setLoading(false)
  }, [error])

  const onSubmit = (values) => {
    const errors = validate(
      { stageErrors: stageErrors.current },
      { stageErrors: 'errorsEmpty'},
      validationMessages
    )

    if (errors) {
      setError(new Error(errors.stageErrors))

      return;
    }

    if (context == 'project' && !router.query.template) {
      setPopup(true);

      return;
    }

    onSave(values)
  }

  const onSave = async (values, templateName) => {
    setLoading(true)

    values.stages = configureStages(values.stages, values.config, true);

    const scoringRules = {
      ...calcDefaultScoringRules(values),
      ...(values.scoringRules || {})
    }

    if (!checkScoringRulesValid(scoringRules)) {
      setError(new Error(t('errors.scoring-rules.invalid')));

      return;
    }

    values.userId = user.id;
    values.companyId = user.companyId;
    values.stagesCount = values.stages.filter(s => s).length;
    values.interviewerCount = values.interviewers.length;
    values.scoringRules = scoringRules;
    values.user = {
      id: user.id,
      name: user.name,
      avatar: user.images && user.images[0].src || null
    }

    packQuestions(values);

    const tasks = [];

    let onSave;

    if (context == 'template') {
      if (record && record.id && record.companyId == 'asker' && user.companyId != 'asker') {
        delete values.id;
      }

      tasks.push(docsApi.save('templates', values));

      onSave = () => {
        if (record && record.id) {
          addFlash(t('status.saved.template'), 'success')
        } else {
          addFlash(t('status.created.template'), 'success')
        }

        router.push('/templates/')
      }
    } else {
      if (templateName) {
        const copy = JSON.parse(JSON.stringify(values));

        copy.name = templateName;

        delete copy.id;

        copy.interviewers = [];

        tasks.push(docsApi.save('templates', copy))

      }

      tasks.push(docsApi.save('projects', values))

      onSave = () => {
        if (record && record.id) {
          addFlash(t('status.saved.project'), 'success')
        } else {
          addFlash(t('status.created.project'), 'success')
        }

        router.push('/projects/')
      }
    }


    Promise.all(tasks)
      .then(onSave)
      .catch(error => {
        setError(ctxError(t('errors.server'), error))
      })
  }

  const handleStageValues = useCallback(values => {
    if (!stage) {
      return;
    }

    const stageId = getStageKey(stage);

    setValue(`config.${stageId}`, values)
  }, [stage])

  const handleStageError = useCallback(error => {
    const stageId = getStageKey(stage);

    let err;

    if (error instanceof Error) {
      err = error.message || error;
    } else {
      err = error;
    }

    stageErrors.current[stageId] = err;
    setStageErrorsLive({ ...stageErrors.current })
  }, [stage])

  const stageValues = useMemo(() => formConfig[getStageKey(stage)], [stage, formConfig])

  useEffect(() => {
    const keys = formStages.map(s => getStageKey(s));

    for (let key in stageErrors.current) {
      if (keys.indexOf(key) > -1) continue;
      delete stageErrors.current[key]
    }

    setStageErrorsLive({ ...stageErrors.current })
  }, [formStages])

  const handleStages = useCallback((stages) => {
    setValue('stages', stages)
  }, [setValue])

  const handleStageAdd = useCallback((stage) => {
    stagesApi.append(stage)
    setStage(stage)
  }, [stagesApi, setStage])

  useEffect(() => {
    let hasValidStage = true;

    if (stage) {
      const found = formStages.find(s => getStageKey(s) ==  getStageKey(stage));

      if (!found) {
        hasValidStage = false;
      }

    } else {
      hasValidStage = false;
    }

    if (!hasValidStage) {
      setStage(formStages.length ? formStages[0] : null)
    }
  }, [formStages, stage])

  const handleName = useCallback((ev) => {
    setValue('name', ev.target.value)
  }, [setValue])

  const handleInterviwer = useCallback(interviewer => {
    setValue('interviewers.0', interviewer)
  }, [setValue])

  const handleScoringRules = useCallback(sr => {
    setValue('scoringRules', sr)
  }, [setValue])

  useEffect(() => {
    const keys = formStages.map(s => getStageKey(s));

    const config = { ...formValues.config }

    for (let key in config) {
      if (keys.indexOf(key) == -1) {
        delete config[key];
      }
    }

    if (JSON.stringify(formValues.config) != JSON.stringify(config)) {
      setValue('config', config)
    }
  }, [setValue, formValues.config, formStages])

  const renderTemplateNameForm = useCallback(() => {
      return <ProjectSaveAsTemplatePopup onSave={templateName => {
        setPopup(false);
        onSave(formValues, templateName)
      }} />
  }, [formValues])

  const buttonWithPopup = useCallback(ref => <Button ref={ref}  type="submit" className={styles['project-form-submit']}>
  {!loading ? (record && record.id ? t('actions.save.project') : t('actions.create.project')) : t('status.loading')}
</Button>, [loading, record])

  const cancelTemplateForm = useCallback(() => {
    setPopup(false)
  }, [])

  return  <form data-test-id="project-form" onSubmit={handleSubmit(onSubmit)} className={classNames(styles['project-form'], className)}>
    <div className={classNames(styles['project-form-sidebar'], styles['project-form-sidebar-left'])}>
      <ProjectFormProcess config={formConfig} onStageAdd={handleStageAdd} errors={isSubmitted && stageErrorsLive} stage={stage} onStage={setStage} onChange={handleStages} stages={formStages} className={styles['project-form-process']} />
    </div>

    <div className={styles['project-form-details']}>

      <div className={styles['project-form-details-inner']}>
    { record && !record.id && record.template ?
        <p className={styles['project-form-template']}>{t('labels.template')}: <span>{record.template.name}</span></p>
        : null}


    <div className={styles['project-form-head']}>
      {
        context == 'project' ?
        <InterviewerSelect
          interviewer={formValues.interviewers && formValues.interviewers[0]}
          onChange={handleInterviwer}
          error={isSubmitted && errors && errors.interviewers}
          className={styles['project-form-interviewer-select']}
        /> : null
      }
      <TextInputField
        value={formValues.name}
        onChange={handleName}
        placeholder={context == 'template' ? t('labels.template.name') : t('labels.project.name')}
        error={isSubmitted && errors && errors.name}
        autoComplete='off'
        name='name'
        type='text'
        className={styles['project-form-field-name']} />
      <div className={styles['project-form-head-group']}>
        <TimeLabel className={styles['project-form-total-time']} time={formValues.time} />
        {
          context == 'project' ?
        <FocusPopup loading={loading} position='br' render={renderTemplateNameForm}
        onCancel={cancelTemplateForm} active={popup}>{buttonWithPopup}</FocusPopup> :
        <Button disabled={loading} type="submit" className={styles['project-form-submit']}>
          {!loading ? (record && record.id ? t('actions.save.template') : t('actions.create-template')) : t('status.loading')}
        </Button>
        }
      </div>
  </div>

    <div className={styles['project-form-body']}>
      {error && <Alert type="error" autoclose={5}>{error.message}</Alert>}

      {stage ? <div className={styles['project-form-feature-form']} data-stage-id={stage.id} id="feature-form" data-test-id="feature-form">
         <FeatureForm test={test} values={stageValues} isSubmitted={isSubmitted} onError={handleStageError} onValues={handleStageValues} feature={stage}  />
        </div> : null}
    </div>

      </div>
    </div>
    {!test ?
    <div className={classNames(styles['project-form-sidebar'], styles['project-form-sidebar-right'])}>
      <ProjectEvaluationCriteria
        project={formValues}
        onScoringRules={handleScoringRules}
        className={styles['project-form-criteria']}
      />
      </div> : null}

    {loading ? <Preloader /> : null}
  </form>
}

export default ProjectForm;
