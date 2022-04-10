import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'

const featureForms = {
  'company-presentation': dynamic(() => import('forms/company-presentation/company-presentation-form'))
}

const FeatureForm = ({ feature, ...props }) => {
  const [FormComponent, setFormComponent] = useState(null);

  useEffect(() => {
    if (feature && featureForms[feature.id]) {
      setFormComponent(featureForms[feature.id]);
    }
  }, [feature])

  return FormComponent ? <FormComponent {...props} /> : null;
}

export default FeatureForm;
