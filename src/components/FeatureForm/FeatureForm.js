import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'

const featureForms = {
  'introduction': dynamic(() => import('forms/introduction-stage/introduction-stage-form')),
  'company-presentation': dynamic(() => import('forms/company-presentation-stage/company-presentation-stage-form')),
  'competency-questions': dynamic(() => import('forms/evaluation-question-stage/evaluation-question-stage-form')),
  'motivation-questions': dynamic(() => import('forms/evaluation-question-stage/evaluation-question-stage-form')),
  'experience-questions': dynamic(() => import('forms/evaluation-question-stage/evaluation-question-stage-form')),
  'hard-skill-questions': dynamic(() => import('forms/evaluation-question-stage/evaluation-question-stage-form')),
  'culture-questions': dynamic(() => import('forms/evaluation-question-stage/evaluation-question-stage-form')),
  'salary': dynamic(() => import('forms/salary-stage/salary-stage-form')),
  'candidate-questions': dynamic(() => import('forms/candidate-questions-stage/candidate-questions-stage-form')),
  'screening-questions': dynamic(() => import('forms/screening-question-stage/screening-question-stage-form')),
  'other-questions': dynamic(() => import('forms/other-question-stage/other-question-stage-form')),
  'summary': dynamic(() => import('forms/summary-stage/summary-stage-form'))
}

const FeatureForm = (props) => {
  const [FormComponent, setFormComponent] = useState(0);
  const [formComponentProps, setProps] = useState({});

  useEffect(() => {
    const { feature } = props;

    if (feature && featureForms[feature.id]) {
      setFormComponent(0);
    }
  }, [props.feature])

  useEffect(() => {
    if (FormComponent !== 0) return;

    const { feature } = props;

    if (feature && featureForms[feature.id]) {
      setFormComponent(featureForms[feature.id]);
      setProps({ ...props });
    }
  }, [props, FormComponent])

  return FormComponent ? <FormComponent {...formComponentProps} /> : null;
}

export default FeatureForm;
