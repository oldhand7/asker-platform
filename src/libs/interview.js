import { features } from 'libs/features';

export const getInterviewAggregate = ({ evaluations, ...details }) => {
  const aggregate = {
    competency: {},
    experience: {},
    'hard-skill': {},
    motivation: [],
    'culture': []
  }

  for (const eKey in evaluations) {
    const [stageId, stageUid] = eKey.split('_');

    const feature = features.find(f => {
      return f.id == stageId && f.metadata && f.metadata.criteria
    })

    if (!feature) {
      continue;
    }

    const { metadata } = feature;

    if (['competency', 'experience', 'hard-skill'].indexOf(metadata.criteria) > -1) {
      const criteriaEvaluations = Object.values(evaluations[eKey]);

      for (let n = 0; n < criteriaEvaluations.length; n++) {
        const { criteria, subtype } = criteriaEvaluations[n]

        if (!aggregate[subtype][criteria.id]) {
          aggregate[subtype][criteria.id] = [criteriaEvaluations[n]]
        } else {
          aggregate[subtype][criteria.id].push(criteriaEvaluations[n])
        }
      }
    } else {
      aggregate[metadata.criteria] = [
        ...aggregate[metadata.criteria],
        ...Object.values(evaluations[eKey])
      ]
    }
  }

  return aggregate;
}
