import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader';
import { saveCollectionDocument } from 'libs/firestore';
import { useForm } from 'libs/react-hook-form';
import { useState, useEffect, useCallback, useMemo } from 'react';
import BrandishButton from 'components/Button/BrandishButton';
import { addFlash} from 'libs/flash';
import StageInterviewForm from 'components/StageInterviewForm/StageInterviewForm';
import { ctxError } from 'libs/helper';
import { calcInterviewScore } from 'libs/scoring';
import { getStageKey } from 'libs/stage';
import InterviewFormSidebar from 'components/InterviewFormSidebar/InterviewFormSidebar';
import InterviewFormTimer from 'components/InterviewFormTimer/InterviewFormTimer';
import InterviewProcessOverview from 'components/InterviewProcessOverview/InterviewProcessOverview';
import NextButton from 'components/Button/NextButton';
import BackIcon from 'components/Icon/BackIcon';
import { createStats } from 'libs/interview';
import { useTranslation } from 'libs/translation';
import { useWatch } from 'react-hook-form';

import styles from './interview-form.module.scss';

const nonStrictStages = [
  'introduction',
  'company-presentation',
  'summary',
  'other-questions',
  'candidate-questions'
]

const validationRules = {
  'errors': 'errorsEmpty'
}

const InterviewForm = ({ className, interview, project }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stages, setStages] = useState(interview.stages || []);
  const [minutes, setMinutes] = useState(typeof interview.time !== 'undefined' ? interview.time : project.time)
  const { t } = useTranslation();
  const [stats, setStats] = useState(createStats(project.stages, interview.stats))
  const [stage, setStage] = useState(null);
  const [nextElement, setNextElement] = useState(null);

  const initValue = useMemo(() => ({
    evaluations: interview.evaluations || {},
    errors: {}
  }), [])

  const validationMessages = useMemo(() => ({
    errorsEmpty: t('errors.field.stages-with-errors')
  }), [router.locale])

  const {
    setValue,
    handleSubmit,
    control
  } = useForm({
    values: initValue,
    rules: validationRules,
    messages: validationMessages
  });

  const formValues = useWatch({ control, defaultValue: initValue })

  const taxStageSecond = useCallback((_stage, question) => {
    const { id: questionId } = question || {};

    //Check if previous stages was nonStrict and mark complete
    if (stage && stage != _stage && nonStrictStages.indexOf(stage.id) > -1) {
      const key = getStageKey(stage);

      const stat = stats.find(stat => stat.id == key)

      if (stat) {
        stat.status = 'complete';
      }
    }

    //Screening and Others have text subtype questions that should not
    if (stage && stage != _stage && stage.id == 'screening-questions') {
      const key = `${stage.id}_${stage.uid}`

      const textQuestionsOnly = stage.config.questions.every(q => q.subtype == 'text')

      const stat = stats.find(stat => stat.id == key)

      if (stat && textQuestionsOnly) {
        stat.status = 'complete';
      }
    }

    const key = getStageKey(_stage)

    let stat;

    if (questionId) {
      stat = stats.find(stat => stat.id == key && stat.questionId == questionId)
    } else {
      stat = stats.find(stat => stat.id == key)
    }

    if (stat && stat.status != 'complete') {
      stat.time++

      setStats([...stats])
    }

    setStage(_stage)
  }, [stage, stats])

  const handleComplete = useCallback((stage, question) => {
    const { id: questionId } = question || {};

    const key = getStageKey(stage);

    let stat;

    if (questionId) {
      stat = stats.find(stat => stat.id == key && stat.questionId == questionId)
    } else {
      stat = stats.find(stat => stat.id == key)
    }

    if (stat) {
      stat.status = 'complete'

      setStats([...stats])
    }
  }, [stats]);

  const onSubmit = (values) => {
    //@TODO: error checking maybe
    const { evaluations } = values;

    setLoading(true);

    interview.evaluations = evaluations;
    interview.status = 'complete'
    interview.score = calcInterviewScore(interview, project)
    interview.time = minutes;
    interview.projectTime = project.time;
    interview.stats = stats.map((stat, index) => {
      const last = stats.length - 1 == index;

      if (last && stage.id == 'screening-questions') {
        //Consider last stage complete if it only has text questions

        const textQuestionsOnly = stage.config.questions.every(q => q.subtype == 'text')

        if (textQuestionsOnly) {
          stat.status = 'complete';

          return stat;
        }
      }

      const parts = stat.id.split('_');

      if (nonStrictStages.indexOf(parts[0]) > -1) {
        stat.status = (stat.time >= 10 || last) ? 'complete' : stat.status;
      }

      return stat;
    });

    saveCollectionDocument('interviews', interview)
      .then(() => {
        addFlash(t('status.interview-complete'))

        router.push(`/projects/${project.id}/overview`)
      })
      .catch(error => {
        setError(ctxError(t('errors.server'), error))
      })
  }

  useEffect(() => {
    setLoading(false);
  }, [error])

  useEffect(() => {
    setStages(project.stages.filter(s => s))
  }, [project])

  const scrollNext = () => {
    nextElement.scrollIntoView({
      behavior: process.env['NEXT_PUBLIC_TESTING'] ? 'auto' : 'smooth',
      block: 'start'
    })
  }

  const focusId = useCallback(id => {
      const el  = document.querySelector(`#${id}`)

      if (el) {
        setNextElement(el.nextElementSibling)
      }
  }, [])
  

  const stageValueHandlers = useMemo(() => {
    return stages.reduce((handlers, stage) => {
      const key = getStageKey(stage)

      handlers[key] = values => {
        setValue(`evaluations.${key}`, typeof values !== "undefined" ? values : null)
      }

      return handlers;
    }, {})
  }, [setValue, stages])

  const stageCompleteHandlers = useMemo(() => {
    return stages.reduce((handlers, stage) => {
      const key = getStageKey(stage)

      handlers[key] = (question) => handleComplete(stage, question)

      return handlers;
    }, {})
  }, [handleComplete, stages])

  const stageTaxHandlers = useMemo(() => {
    return stages.reduce((handlers, stage) => {
      const key = getStageKey(stage)

      handlers[key] = (question) => taxStageSecond(stage, question)

      return handlers;
    }, {})
  }, [taxStageSecond, stages])


  return <form className={classNames(styles['interview-form'], className)} onSubmit={handleSubmit(onSubmit)}>
    <div className={styles['interview-form-stages-wrapper']}>
      <div className={styles['interview-form-stages']}>
        <h1 className={styles['interview-form-title']}>
          <span>{interview.candidate.name}</span>
        </h1>

        {error && <Alert type="error">{error.message}</Alert>}

        {stages.map((stage, index) => {
          const key = getStageKey(stage)

          return <StageInterviewForm
            stage={stage}
            values={formValues.evaluations[key]}
            onValues={stageValueHandlers[key]}
            className={classNames(
              styles['interview-form-stage'],
              index == stages.length - 1 ? styles['interview-form-stage-last'] : ''
            )}
            key={key}
            id={key}
            markComplete={stageCompleteHandlers[key]}
            taxStageSecond={stageTaxHandlers[key]}
            onFocusId={focusId}
            index={index}
            project={project} />
        })}
      </div>
      {nextElement ? <NextButton className={styles['interview-form-next']} onClick={scrollNext} /> : null}
      {!nextElement && stage ? <BrandishButton className={styles['interview-form-complete']}>{!loading ? t('actions.complete-interview') : t('status.loading')}</BrandishButton> : null}
    </div>

    <InterviewFormSidebar className={styles['interview-form-sidebar']}>
      <InterviewFormTimer totalStages={stats.length} completeStages={stats.filter(s => s.status == 'complete').length} className={styles['interview-form-sidebar-widget']} totalTime={project.time} availableTime={minutes} onTime={setMinutes} />
      <InterviewProcessOverview stats={stats} className={styles['interview-form-sidebar-widget']} />
    </InterviewFormSidebar>

    {loading ? <Preloader /> : null}

    <button title={t('labels.cancel')} type="button" onClick={() => window.location = `/projects/${[project.id]}/overview`}  className={styles['interview-form-back']}>
      <BackIcon className={styles['interview-form-back-icon']} />
    </button>
  </form>
}

export default InterviewForm;
