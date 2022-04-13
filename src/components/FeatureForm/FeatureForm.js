import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'

const featureForms = {
  'introduction': dynamic(() => import('forms/introduction/introduction-form')),
  'company-presentation': dynamic(() => import('forms/company-presentation/company-presentation-form'))
}

const FeatureForm = ({ feature, ...props }) => {
  const [FormComponent, setFormComponent] = useState(null);

  useEffect(() => {
    if (feature && featureForms[feature.id]) {
      setFormComponent(featureForms[feature.id]);
    }
  }, [feature])

  return FormComponent ? <div data-test-id="feature-form"><FormComponent {...props} /></div> : null;
}

export default FeatureForm;
