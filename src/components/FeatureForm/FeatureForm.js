import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'

const featureForms = {
  'introduction': dynamic(() => import('forms/introduction/introduction-form')),
  'company-presentation': dynamic(() => import('forms/company-presentation/company-presentation-form')),
  'competency-questions': dynamic(() => import('forms/evaluation-question/evaluation-question-form')),
  'motivation-questions': dynamic(() => import('forms/evaluation-question/evaluation-question-form')),
  'experience-questions': dynamic(() => import('forms/evaluation-question/evaluation-question-form')),
  'hard-skill-questions': dynamic(() => import('forms/evaluation-question/evaluation-question-form')),
  'culture-fit-questions': dynamic(() => import('forms/evaluation-question/evaluation-question-form')),
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

  return FormComponent ? <div data-test-id="feature-form">
    <FormComponent {...formComponentProps} />
  </div> : null;
}

export default FeatureForm;
