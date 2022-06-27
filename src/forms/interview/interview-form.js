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

const createStats = (stages = [], oldStats) => {
  const stats = [];

  const granularFeatures = [
    'competency-questions',
    'experience-questions',
    'hard-skill-questions',
    'motivation-questions',
    'culture-fit-questions'
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
            name: criteria ? criteria.name : ucFirst(subtype),
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
  const [stats, setStats] = useState(createStats(project.stages, interview.stats))
  const [stage, setStage] = useState(null);

  const taxStageSecond = useCallback((_stage, questionId) => {
    //Check if previous stages was nonStrict and mark complete
    if (stage && stage != _stage && nonStrictStages.indexOf(stage.id) > -1) {
      const key = `${stage.id}_${stage.uid}`
      
      const stat = stats.find(stat => stat.id == key)

      if (stat) {
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
      const parts = stat.id.split('_');

      if (nonStrictStages.indexOf(parts[0]) > -1) {
        const last = stats.length - 1 == index;

        stat.status = (stat.time >= 10 || last) ? 'complete' : stat.status;
      }

      return stat;
    });

    saveCollectionDocument('interviews', interview)
      .then(() => {
        addFlash('Interview complete')

        router.push(`/projects/${project.id}/overview`)
      })
      .catch(error => {
        setError(ctxError('Server error', error))
      })
  }

  useEffect(() => {
    setLoading(false);
  }, [error])

  useEffect(() => {
    setStages(project.stages.filter(s => s))
  }, [project])

  return <form className={classNames(styles['interview-form'], className)} onSubmit={control.submit(handleSubmit)}>


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
          stage={stage}
          index={index}
          last={index == stages.length - 1}
          nextId={index < stages.length - 1 ? `${getStageKey(stages[index+1])}` : null}
          project={project} />
      })}

      <p style={{textAlign: 'center'}}>
        <BrandishButton className={styles['interview-form-submit']}>{!loading ? 'Complete interview' : 'Loading...'}</BrandishButton>
      </p>
    </div>

    <InterviewFormSidebar className={styles['interview-form-sidebar']}>
      <div className={styles['interview-form-nav']}>
        <button type="button" onClick={() => window.location = `/projects/${[project.id]}/overview`}  className={styles['interview-form-back']}>
            <span className={styles['interview-form-back-text']}>Cancel interview</span>
        </button>
      </div>
      <InterviewFormTimer totalStages={stats.length} completeStages={stats.filter(s => s.status == 'complete').length}  className={styles['interview-form-sidebar-widget']} totalTime={project.time} availableTime={minutes} onTime={setMinutes} />
      <InterviewProcessOverview stats={stats} className={styles['interview-form-sidebar-widget']} />
    </InterviewFormSidebar>

    {loading ? <Preloader /> : null}
  </form>
}

export default InterviewForm;
