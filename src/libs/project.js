import { projectStageQuestionsReducer, getSubtype, ucFirst } from 'libs/helper';
const fixWeight = val => Number.parseFloat(Number.parseFloat(val).toFixed(2))

export const getProjectEvaluationCriterias = (project) => {
  const { config, scoringRules } = project;

  if (!config) {
    return [];
  }

  const questions = Object.values(config)
    .reduce(projectStageQuestionsReducer, [])
    .filter(q => {
      const subtype = getSubtype(q);

      return subtype != 'screening' && subtype != 'other'
    })

  const aggregate = {
    'hard-skill': questions.filter(q => getSubtype(q) == 'hard-skill'),
    'motivation': questions.filter(q => getSubtype(q) == 'motivation'),
    'culture-fit': questions.filter(q => getSubtype(q) == 'culture-fit'),
    competency: {},
    experience: {},
  }

  const criteriaQuestions = [
    ...questions.filter(q => getSubtype(q) == 'competency'),
    ...questions.filter(q => getSubtype(q) == 'experience')
  ]

  for (let i = 0; i < criteriaQuestions.length; i++) {
    const { criteria } = criteriaQuestions[i];
    const subtype = getSubtype(criteriaQuestions[i]);

    if (!aggregate[subtype][criteria.id]) {
      aggregate[subtype][criteria.id] = [criteriaQuestions[i]]
    } else {
      aggregate[subtype][criteria.id].push(criteriaQuestions[i])
    }
  }

  const criterias = [];

  for (let i = 0; i < Object.values(criteriaQuestions).length; i++) {
    const { criteria } = criteriaQuestions[i];
    const subtype = getSubtype(criteriaQuestions[i]);

    if (!aggregate[subtype][criteria.id]) {
      continue;
    }

    const customP = scoringRules && scoringRules[criteria.id];
    const p = aggregate[subtype][criteria.id].length * 100 / questions.length;

    delete aggregate[subtype][criteria.id]

    criterias.push({
      ...criteria,
      weight: fixWeight(customP || p)
    })
  }

  const categoryQuestions = [
    ...aggregate['culture-fit'],
    ...aggregate['hard-skill'],
    ...aggregate['motivation']
  ]

  for (let i = 0; i < categoryQuestions.length; i++) {
    const subtype = getSubtype(categoryQuestions[i])

    const customP = scoringRules && scoringRules[subtype];
    const p = aggregate[subtype].length * 100 / questions.length;

    criterias.push({
      name: ucFirst(subtype),
      type: subtype,
      weight: fixWeight(customP || p)
    })
  }

  criterias.sort(function(ca, cb) {
    if (ca.weight < cb.weight) return 1;
    if (ca.weight > cb.weight) return -1;

    return 0;
  });

  return criterias;
}

export const calcDefaultScoringRules = project => {
  const rules = {}

  const criterias = getProjectEvaluationCriterias(project);

  for (let i = 0; i < criterias.length; i++) {
    const { id, type, weight } = criterias[i]
    rules[id || type] = weight;
  }

  return rules;
}
