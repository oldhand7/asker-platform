import classNames from 'classnames';
import Alert from 'components/Alert/Alert';
import { useRouter } from 'next/router';
import Preloader from 'components/Preloader/Preloader';
import { saveCollectionDocument } from 'libs/firestore';
import useForm from 'libs/use-form';
import { useState, useEffect, useCallback} from 'react';
import BrandishButton from 'components/Button/BrandishButton';
import { addFlash} from 'libs/flash';
import StageInterviewForm from 'components/StageInterviewForm/StageInterviewForm';
import styles from './interview-form.module.scss';
import { ctxError } from 'libs/helper';
import { calcInterviewScore } from 'libs/scoring';
import { getStageKey } from 'libs/stage';
import InterviewFormSidebar from 'components/InterviewFormSidebar/InterviewFormSidebar';
import InterviewFormTimer from 'components/InterviewFormTimer/InterviewFormTimer';
import InterviewProcessOverview from 'components/InterviewProcessOverview/InterviewProcessOverview';
import { ucFirst } from 'libs/helper';
import NextButton from 'components/Button/NextButton';
import BackIcon from 'components/Icon/BackIcon';
import { useSite } from 'libs/site';

import { EVALUATION_CRITERIA_TYPES } from 'libs/criteria';

const createStats = (stages = [], oldStats, t) => {
  const stats = [];

  const granularFeatures = [
    'competency-questions',
    'experience-questions',
    'hard-skill-questions',
    'motivation-questions',
    'culture-questions'
  ]

  for (let i = 0; i < stages.length; i++) {
    const { id, uid, config, name } = stages[i]; 

    const key = `${id}_${uid}`;

    if (granularFeatures.indexOf(id) > -1) {
      const { questions } = config || {};

      for (let k = 0; k < (questions || []).length; k++) {
        const { id, criteria, name, subtype } = questions[k];

        const oldStat = (oldStats || []).find(stat => stat.id == key && stat.questionId == id)

        if (oldStat) {
          stats.push(oldStat)
        } else {
          stats.push({
            id: key,
            questionId: id,
            name: criteria ? criteria.name : t(EVALUATION_CRITERIA_TYPES[subtype].name),
            hint: name,
            status: 'awaiting',
            questions: 1,
            time: 0
          })
        }
      }
    } else {
      let hint = name;

      if (config && config.questions) {
        hint = `${config.questions.length} questions`
      }

      const oldStat = (oldStats || []).find(stat => stat.id == key)

      if (oldStat) {
        stats.push(oldStat)
      } else {
        stats.push({
          id: key,
          name,
          status: 'awaiting',
          hint,
          questions: (config && config.questions || []).length,
          time: 0
        })
      }
    }
  }

  return stats;
}

const nonStrictStages = [
  'introduction',
  'team-role-presentation',
  'company-presentation',
  'summary',
  'candidate-questions'
]

const InterviewForm = ({ className, interview, project }) => {
  const [values, errors, control] = useForm({
    values: interview.evaluations
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [stages, setStages] = useState([]);
  const [minutes, setMinutes] = useState(typeof interview.time !== 'undefined' ? interview.time : project.time)
  const { t } = useSite();
  const [stats, setStats] = useState(createStats(project.stages, interview.stats, t))
  const [stage, setStage] = useState(null);
  const [nextElement, setNextElement] = useState(null);

  const taxStageSecond = useCallback((_stage, questionId) => {
    //Check if previous stages was nonStrict and mark complete
    if (stage && stage != _stage && nonStrictStages.indexOf(stage.id) > -1) {
      const key = `${stage.id}_${stage.uid}`
      
      const stat = stats.find(stat => stat.id == key)

      if (stat) {
        stat.status = 'complete';
      }
    }

    //Screening and Others have text subtype questions that should not 
    if (stage && stage != _stage && (stage.id == 'screening-questions' || stage.id == 'other-questions')) {
      const key = `${stage.id}_${stage.uid}`

      const textQuestionsOnly = stage.config.questions.every(q => q.subtype == 'text')
      
      const stat = stats.find(stat => stat.id == key)

      if (stat && textQuestionsOnly) {
        stat.status = 'complete';
      }
    }

    const key = `${_stage.id}_${_stage.uid}`

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
  }, [stage, interview])

  const handleComplete = (stage, questionId) => {
    const key = `${stage.id}_${stage.uid}`

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
  }

  const handleSubmit = (values) => {
    setLoading(true);

    interview.evaluations = values;
    interview.status = 'complete'
    interview.score = calcInterviewScore(interview, project)
    interview.time = minutes;
    interview.projectTime = project.time;
    interview.stats = stats.map((stat, index) => {
      const last = stats.length - 1 == index;

      if (last && stage.id == 'other-questions' || stage.id == 'screening-questions') {
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
        addFlash(t('Interview complete'))

        router.push(`/projects/${project.id}/overview`)
      })
      .catch(error => {
        setError(ctxError(t('Server error'), error))
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

  return <form className={classNames(styles['interview-form'], className)} onSubmit={control.submit(handleSubmit)}>
    <div className={styles['interview-form-stages-wrapper']}>
      <div className={styles['interview-form-stages']}>
        <h1 className={styles['interview-form-title']}>
          <span>{interview.candidate.name}</span>
        </h1>

        {error ? <Alert type="error">{error.message}</Alert> : null}

        {stages.map((stage, index) => {
          const key = getStageKey(stage)

          return <StageInterviewForm
            onValues={control.input(key, false)}
            values={values[key]}
            className={classNames(
              styles['interview-form-stage'],
              index == stages.length - 1 ? styles['interview-form-stage-last'] : ''
            )}
            key={key}
            id={key}
            stats={stats.filter(stat => stat.id == key)}
            markComplete={questionId => handleComplete(stage, questionId)}
            taxStageSecond={(questionId) => taxStageSecond(stage, questionId)}
            onFocusId={id => {
              const el  = document.querySelector(`#${id}`)
              
              setNextElement(el.nextElementSibling)
            }}
            stage={stage}
            index={index}
            project={project} />
        })}
      </div>
      {nextElement ? <NextButton className={styles['interview-form-next']} onClick={scrollNext} /> : null}
      {!nextElement && stage ? <BrandishButton className={styles['interview-form-complete']}>{!loading ? t('Complete interview') : t('Loading...')}</BrandishButton> : null}
    </div>

    <InterviewFormSidebar className={styles['interview-form-sidebar']}>
      <InterviewFormTimer totalStages={stats.length} completeStages={stats.filter(s => s.status == 'complete').length}  className={styles['interview-form-sidebar-widget']} totalTime={project.time} availableTime={minutes} onTime={setMinutes} />
      <InterviewProcessOverview stats={stats} className={styles['interview-form-sidebar-widget']} />
    </InterviewFormSidebar>

    {loading ? <Preloader /> : null}

    <button title="Cancel" type="button" onClick={() => window.location = `/projects/${[project.id]}/overview`}  className={styles['interview-form-back']}>
      <BackIcon className={styles['interview-form-back-icon']} />
    </button>
  </form>
}

export default InterviewForm;
