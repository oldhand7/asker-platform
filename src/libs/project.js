import { projectStageQuestionsReducer, getSubtype, ucFirst } from 'libs/helper';
import { flattenCriteriaTree } from 'libs/criteria';
import { fixFloat } from 'libs/helper'
import { getStageTime } from './stage';

const weightSort = function(ca, cb) {
  if (ca.weight < cb.weight) return 1;
  if (ca.weight > cb.weight) return -1;

  if (ca.name) {
    if (ca.name < cb.name) return -1;
    if (ca.name > cb.name) return 1;
  }

  return 0;
}

export const getProjectEvaluationCriterias = (project) => {
  const { stages, scoringRules } = project;

  const questions = stages.filter(s => s && s.config).map(s => s.config)
    .reduce(projectStageQuestionsReducer, [])
    .filter(({ type }) => {
      return type != 'screening' && type != 'other';
    })

  const aggregate = {
    'motivation': questions.filter(q => getSubtype(q) == 'motivation'),
    'culture-fit': questions.filter(q => getSubtype(q) == 'culture-fit'),
    'hard-skill': {},
    competency: {},
    experience: {},
  }

  const criteriaQuestions = [
    ...questions.filter(q => getSubtype(q) == 'competency'),
    ...questions.filter(q => getSubtype(q) == 'experience'),
    ...questions.filter(q => getSubtype(q) == 'hard-skill')
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

  const categoryQuestions = [
    'culture-fit',
    'motivation'
  ]

  const result = []

  for (const key in aggregate) {
    if (categoryQuestions.indexOf(key) > -1) {
      if (!aggregate[key].length) {
        continue;
      }

      const customP = scoringRules && scoringRules[key];
      const p = aggregate[key].length * 100 / questions.length;

      result.push({
        name: ucFirst(key),
        type: key,
        weight: fixFloat(customP || p),
        questions: aggregate[key].length
      })
    } else {
      if (!Object.values(aggregate[key]).length) {
        continue;
      }

      const evaluationAggregate = {
        name: ucFirst(key),
        type: key,
        weight: 0,
        children: []
      }

      for (const subtype in aggregate[key]) {
        const customP = scoringRules && scoringRules[subtype];
        const p = aggregate[key][subtype].length * 100 / questions.length;

        const w = fixFloat(customP || p);

        evaluationAggregate.children.push({
          name: aggregate[key][subtype][0].criteria.name,
          type: subtype,
          weight: w,
          questions: aggregate[key][subtype].length
        })

        evaluationAggregate.weight += w;
        evaluationAggregate.questions += aggregate[key][subtype].length;
      }

      evaluationAggregate.children.sort(weightSort)
      evaluationAggregate.weight = fixFloat(evaluationAggregate.weight)

      result.push(evaluationAggregate)
    }
  }

  result.sort(weightSort);

  return result.filter(r => r.weight);
}

export const calcDefaultScoringRules = project => {
  const criteriaTree = getProjectEvaluationCriterias(project);

  return flattenCriteriaTree(criteriaTree);
}

export const unpackQuestions = p => {
  if (!p.questionsMap) return;

  for (let i = 0; i < p.stages.length; i++) {
    if (!p.stages[i]) continue;

    const { config } = p.stages[i]

    if (config && config.questions) {
      const questions = config.questions
        .map(qid => p.questionsMap[qid])
        .filter(q => q)

       config.questions = questions;
    }
  }
}

export const packQuestions = p => {
  const questionsMap = {}

  for (let i = 0; i < p.stages.length; i++) {
    if (!p.stages[i]) continue;

    const { config } = p.stages[i]

    if (config && config.questions) {
      config.questions = config.questions.map(q => {
        questionsMap[q.id] = q;

        return q.id;
      })
    }
  }

  p.questionsMap = questionsMap;
}

export const getProjectMinutes = project => {
  return project.stages.filter(s => s)
    .reduce((sum, s) => sum + getStageTime(s), 0)
}
