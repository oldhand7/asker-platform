import { memo } from 'react';
import dynamic from 'next/dynamic'
import { getStageKey } from 'libs/stage';

const featureForms = {
  'introduction': () => import('forms/introduction-stage/introduction-stage-form'),
  'company-presentation': () => import('forms/company-presentation-stage/company-presentation-stage-form'),
  'competency-questions': () => import('forms/evaluation-question-stage/evaluation-question-stage-form'),
  'motivation-questions': () => import('forms/evaluation-question-stage/evaluation-question-stage-form'),
  'experience-questions': () => import('forms/evaluation-question-stage/evaluation-question-stage-form'),
  'hard-skill-questions': () => import('forms/evaluation-question-stage/evaluation-question-stage-form'),
  'culture-questions': () => import('forms/evaluation-question-stage/evaluation-question-stage-form'),
  'salary': () => import('forms/salary-stage/salary-stage-form'),
  'candidate-questions': () => import('forms/candidate-questions-stage/candidate-questions-stage-form'),
  'screening-questions': () => import('forms/screening-question-stage/screening-question-stage-form'),
  'other-questions': () => import('forms/other-question-stage/other-question-stage-form'),
  'summary': () => import('forms/summary-stage/summary-stage-form')
}

const FeatureForm = ({ feature, isSubmitted, ...props }) => {
  const FormComponent = dynamic(featureForms[feature.id])

  return <FormComponent className={props.className} test={props.test} feature={feature} values={props.values} isSubmitted={isSubmitted} onValues={props.onValues} onError={props.onError} />
}

const FeatureFormMemo = memo(FeatureForm, (prev, next) => {
  if (prev.isSubmitted != next.isSubmitted) {
    return false;
  }

  return getStageKey(prev.feature) == getStageKey(next.feature)
});

FeatureFormMemo.displayName = 'FeatureForm';

export default FeatureFormMemo;
