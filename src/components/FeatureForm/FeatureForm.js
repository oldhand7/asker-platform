import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'

const featureForms = {
  'introduction': dynamic(() => import('forms/introduction/introduction-form')),
  'company-presentation': dynamic(() => import('forms/company-presentation/company-presentation-form')),
  'team-role-presentation': dynamic(() => import('forms/team-role-presentation/team-role-presentation-form')),
  'competency-questions': dynamic(() => import('forms/evaluation-question1/evaluation-question-form')),
  'motivation-questions': dynamic(() => import('forms/evaluation-question1/evaluation-question-form')),
  'experience-questions': dynamic(() => import('forms/evaluation-question1/evaluation-question-form')),
  'hard-skill-questions': dynamic(() => import('forms/evaluation-question1/evaluation-question-form')),
  'culture-fit-questions': dynamic(() => import('forms/evaluation-question1/evaluation-question-form')),
}

const FeatureForm = (props) => {
  const [FormComponent, setFormComponent] = useState(null);
  const [formComponentProps, setProps] = useState({});

  useEffect(() => {
    const { feature } = props;

    if (feature && featureForms[feature.id]) {
      setFormComponent(featureForms[feature.id]);
      setProps({ ...props });
    }
  }, [props])

  return FormComponent ? <FormComponent {...formComponentProps} /> : null;
}

export default FeatureForm;
