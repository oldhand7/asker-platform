import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic'
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import InterviewStageTimeLabel from 'components/InterviewStageTimeLabel/InterviewStageTimeLabel';
import styles from './StageInterviewForm.module.scss';
import { DEFAULT_STAGE_TIME } from 'libs/config';

const stageForms = {
  'introduction': dynamic(() => import('forms/introduction-int/introduction-int-form')),
  'company-presentation': dynamic(() => import('forms/company-presentation-int/company-presentation-int-form')),
  'team-role-presentation': dynamic(() => import('forms/team-role-presentation-int/team-role-presentation-int-form')),
  'competency-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'experience-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'motivation-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'hard-skill-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'culture-fit-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'salary': dynamic(() => import('forms/salary-int/salary-int-form')),
  'candidate-questions': dynamic(() => import('forms/candidate-questions-int/candidate-questions-int-form')),
  'screening-questions': dynamic(() => import('forms/screening-questions-int/screening-questions-int-form')),
  'other-questions': dynamic(() => import('forms/other-questions-int/other-questions-int-form')),
  'summary': dynamic(() => import('forms/summary-int/summary-int-form'))
}

const evaluationQuestions = [
  'competency-questions',
  'experience-questions',
  'hard-skill-questions',
  'motivation-questions',
  'culture-fit-questions'
]

const StageInterviewForm = (props) => {
  const isMultistage = useMemo(
    () => !props.question && evaluationQuestions.indexOf(props.stage.id) > -1,
    [props]
  )

  const [FormComponent, setFormComponent] = useState(null);
  const [formComponentProps, setFormComponentProps] = useState({});

  const { ref, inView } = useInView({
    threshold: 0.7
  });

  useEffect(() => {
    if (!inView || !props.taxStageSecond) return;

    const timeHandler = () => {
      props.taxStageSecond(props.question && props.question.id)
    }

    const int = setInterval(timeHandler, 1000)

    return () => clearInterval(int)
  }, [inView, props])

  useEffect(() => {
    if (inView) {
      props.onFocusId(`stage-${props.id}`)
    }
  }, [inView, props.id, props.onFocusId])

  useEffect(() => {
    const { stage } = props;

    if (stage && stageForms[stage.id]) {
      setFormComponent(stageForms[stage.id]);
      setFormComponentProps({ ...props })
    }
  }, [props])

  if (isMultistage) {
    return props.stage.config.questions.map((q, qIndex) => {
      return <StageInterviewForm
        key={q.id}
        {...props}
        values={props.values && props.values[q.id]}
        onValues={values => {
          props.onValues({
            ...props.values,
            [q.id]: values
          })
        }}
        question={q}
        id={`${props.id}-${q.id}`}
      />
    })
  }

  return <div
    ref={ref}
    id={`stage-${props.id}`}
    data-test-id="feature-form"
    className={classNames(
      styles['stage-interview-form'],
      props.className
    )} >
    {
      FormComponent ?
      <>
      <InterviewStageTimeLabel className={styles['stage-interview-form-timer']} time={props.stage.time || DEFAULT_STAGE_TIME} />
      <FormComponent config={props.stage.config} {...formComponentProps} className={styles['stage-interview-form-form']} />
      
      </> : null
  }
  </div>
}

export default StageInterviewForm;
