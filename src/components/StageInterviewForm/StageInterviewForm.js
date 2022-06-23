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
  'competency-questions': dynamic(() => import('forms/evaluation-questions-multiple/evaluation-questions-multiple-form')),
  'experience-questions': dynamic(() => import('forms/evaluation-questions-multiple/evaluation-questions-multiple-form')),
  'motivation-questions': dynamic(() => import('forms/evaluation-questions-multiple/evaluation-questions-multiple-form')),
  'hard-skill-questions': dynamic(() => import('forms/evaluation-questions-multiple/evaluation-questions-multiple-form')),
  'culture-fit-questions': dynamic(() => import('forms/evaluation-questions-multiple/evaluation-questions-multiple-form')),
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
  const [FormComponent, setFormComponent] = useState(null);
  const [formComponentProps, setProps] = useState({});
  const { ref, inView, entry } = useInView({
    threshold: 0.7
  });

  const isMultistage = useMemo(
    () => evaluationQuestions.indexOf(props.stage.id) > -1,
    [props.stage]
  )

  useEffect(() => {
    if (isMultistage) {
      return;
    }

    if (inView && props.taxStageSecond) {
      const timeHandler = () => {
        props.taxStageSecond()
      }

      const int = setInterval(timeHandler, 1000)

      return () => clearInterval(int)
    }
  }, [isMultistage, inView, props.taxStageSecond, props.stage])

useEffect(() => {
    const { stage } = props;

    if (stage && stageForms[stage.id]) {
      setFormComponent(stageForms[stage.id]);
      setProps({ ...props });
    }
  }, [props])

  return FormComponent ? <div ref={ref} className={classNames(
    styles['stage-interview-form'],
    props.last ? styles['stage-interview-form-last'] : ''
  )} id={`stage-${props.id}`} data-test-id={!isMultistage ? "feature-form" : ''}>
    {
      !isMultistage ?
      <InterviewStageTimeLabel className={styles['stage-interview-form-timer']} time={props.stage.time || DEFAULT_STAGE_TIME} /> : 
      null
    }
    <FormComponent config={props.stage.config} {...formComponentProps} />
  </div> : null;
}

export default StageInterviewForm;
