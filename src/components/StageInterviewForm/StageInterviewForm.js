import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'
import classNames from 'classnames';

import styles from './StageInterviewForm.module.scss';

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

const StageInterviewForm = (props) => {
  const [FormComponent, setFormComponent] = useState(null);
  const [formComponentProps, setProps] = useState({});

  useEffect(() => {
    const { stage } = props;

    if (stage && stageForms[stage.id]) {
      setFormComponent(stageForms[stage.id]);
      setProps({ ...props });
    }
  }, [props])

  return FormComponent ? <div className={classNames(
    styles['stage-interview-form'],
    props.last ? styles['stage-interview-form-last'] : ''
  )} id={`feature-form-${props.id}`} data-test-id="feature-form">
    <FormComponent config={props.stage.config} {...formComponentProps} />
  </div> : null;
}

export default StageInterviewForm;
