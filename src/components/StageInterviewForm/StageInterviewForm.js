import { useEffect, useMemo, memo } from 'react';
import dynamic from 'next/dynamic'
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import InterviewStageTimeLabel from 'components/InterviewStageTimeLabel/InterviewStageTimeLabel';
import styles from './StageInterviewForm.module.scss';
import { DEFAULT_STAGE_TIME } from 'libs/config';
import { useForm } from 'libs/react-hook-form';
import { isMultistage } from 'libs/stage';

const stageForms = {
  'introduction': dynamic(() => import('forms/introduction-int/introduction-int-form')),
  'company-presentation': dynamic(() => import('forms/company-presentation-int/company-presentation-int-form')),
  'competency-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'experience-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'motivation-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'hard-skill-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'culture-questions': dynamic(() => import('forms/evaluation-question-int/evaluation-question-int-form')),
  'salary': dynamic(() => import('forms/salary-int/salary-int-form')),
  'candidate-questions': dynamic(() => import('forms/candidate-questions-int/candidate-questions-int-form')),
  'screening-questions': dynamic(() => import('forms/screening-questions-int/screening-questions-int-form')),
  'other-questions': dynamic(() => import('forms/other-questions-int/other-questions-int-form')),
  'summary': dynamic(() => import('forms/summary-int/summary-int-form'))
}

const StageInterviewForm = ({ onValues, values, stage, stages = stageForms, question, taxStageSecond, markComplete, id, onFocusId, className, ...props}) => {
  const initValues = useMemo(() => values, []);

  const {
    values: formValues,
    setValue
  } = useForm({
    values: initValues
  })

  const notQuestionMultistage = useMemo(() => !question && isMultistage(stage), [question, stage])

  const { ref, inView } = useInView({
    threshold: 0.7
  });

  useEffect(() => {
    if (!inView || !taxStageSecond) return;

    const int = setInterval(() => {
      taxStageSecond(question)
    }, 1000)

    return () => clearInterval(int)
  }, [inView, taxStageSecond, question])

  useEffect(() => {
    if (inView) {
      onFocusId && onFocusId(`stage-${id}`)
    }
  }, [inView, id, onFocusId])

  const questionInputHandlers = useMemo(() => {
    if (!notQuestionMultistage) {
      return {};
    }

    return stage.config.questions.reduce((handlers, question) => {
      handlers[question.id] = values => setValue(question.id, values)

      return handlers;
    }, {})
  }, [notQuestionMultistage, stage, setValue])

  const questionCompleteHandlers = useMemo(() => {
    if (!notQuestionMultistage) {
      return {}
    }

    return stage.config.questions.reduce((handlers, question) => {
      handlers[question.id] = () => markComplete(question);
    
      return handlers;
    }, {})
  }, [notQuestionMultistage, markComplete, stage])

  useEffect(() => {
    notQuestionMultistage && onValues && onValues(formValues)
  }, [formValues, notQuestionMultistage, onValues])

  const time = useMemo(() => {
    return stage.config && stage.config.time || DEFAULT_STAGE_TIME;
  }, [stage]);

  const FormComponent = useMemo(() => stages[stage.id], [stage, stages])

  if (notQuestionMultistage) {
    return stage.config.questions.map(q => {
      return <StageInterviewForm
        key={q.id}
        values={formValues && formValues[q.id]}
        onValues={questionInputHandlers[q.id]}
        config={stage.config.questions[q.id]}
        question={q}
        onFocusId={onFocusId}
        stages={stages}
        className={className}
        markComplete={questionCompleteHandlers[q.id]}
        taxStageSecond={taxStageSecond}
        stage={stage}
        {...props}
        id={`${id}-${q.id}`}
      />
    })
  }

  return <div
    ref={ref}
    id={`stage-${id}`}
    data-test-id="feature-form"
    className={classNames(
      styles['stage-interview-form'],
      className
    )}>
    {
      FormComponent ?
      <>
        <InterviewStageTimeLabel className={styles['stage-interview-form-timer']} time={time} />
        <FormComponent
          {...props}
          values={values}
          onValues={onValues}
          onFocusId={onFocusId}
          question={question}
          markComplete={markComplete}
          stage={stage}
          config={props.config || stage.config}
          className={styles['stage-interview-form-form']}
        />
      </> : null
  }
  </div>
}

export default memo(StageInterviewForm);
