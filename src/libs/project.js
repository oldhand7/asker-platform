import { projectStageQuestionsReducer, getSubtype, ucFirst } from 'libs/helper';
import { flattenCriteriaTree } from 'libs/criteria';
import { fixFloat } from 'libs/helper'
import { getStageTime } from './stage';
import { DEFAULT_STAGE_TIME } from 'libs/config';
import { getStageKey } from 'libs/stage';

const weightSort = function(ca, cb) {
  if (ca.weight < cb.weight) return 1;
  if (ca.weight > cb.weight) return -1;

  if (ca.name) {
    if (ca.name < cb.name) return -1;
    if (ca.name > cb.name) return 1;
  }

  return 0;
}

export const getProjectEvaluationCriterias = (project, trans = {}) => {
  const { config, scoringRules } = project;

  const {
    t, i18nField
  } = trans;

  const stages = Object.values(config);

  const questions = stages.filter(s => s)
    .reduce(projectStageQuestionsReducer, [])
    .filter(({ type }) => {
      return type != 'screening' && type != 'other';
    })

  const aggregate = {
    'motivation': questions.filter(q => getSubtype(q) == 'motivation'),
    'culture': questions.filter(q => getSubtype(q) == 'culture'),
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

  const categoryQuestions = {
    'culture': t ? t('labels.culture') : 'Culture',
    'motivation': t ? t('labels.motivation') : 'Motivation'
  }

  const result = []

  for (const key in aggregate) {
    if (categoryQuestions[key]) {
      if (!aggregate[key].length) {
        continue;
      }

      const customP = scoringRules && scoringRules[key];
      const p = aggregate[key].length * 100 / questions.length;

      result.push({
        name: categoryQuestions[key],
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
          name: i18nField ? i18nField(aggregate[key][subtype][0].criteria.name) : aggregate[key][subtype][0].criteria.name,
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
       p.config[getStageKey(p.stages[i])].questions = questions;
    }
  }
}

export const packQuestions = p => {
  const questionsMap = {}

  for (let i = 0; i < p.stages.length; i++) {
    if (!p.stages[i]) continue;

    const { config } = p.stages[i]

    if (config && config.questions) {
      const questions = config.questions.map(q => {
        questionsMap[q.id] = q;

        return q.id;
      })

      config.questions = questions;
      p.config[getStageKey(p.stages[i])].questions = questions;
    }
  }

  p.questionsMap = questionsMap;
}

export const getProjectMinutes = project => {
  return project.stages.filter(s => s)
    .reduce((sum, s) => sum + getStageTime(s), 0)
}

export const checkScoringRulesValid = (scoringRules) => {
  const weights = Object.values(scoringRules || {});

  if (!weights.length) {
    return true;
  }

  const sum = weights.reduce((sum, weight) => Number.parseFloat(weight) + sum, 0);

  return Math.round(sum) == 100
}


export const calcProjectTime = p => {
  const { config, stages } = p;

  let time = 0;

  for (let i = 0; i < stages.length; i++) {
    const stageId = getStageKey(stages[i])

    if (config && config[stageId] && typeof config[stageId].time !== "undefined") {
      time += Number.parseInt(config[stageId].time)
    } else if (typeof stages[i].time !== "undefined") {
      time += Number.parseInt(config[stageId].time)
    } else {
      time += DEFAULT_STAGE_TIME;
    }
  }

  return time;
}

export const configureStages = (stages = [], config = {}, remove = false)=> {
  const stageKeys = stages.map(s => getStageKey(s))

  if (remove) {
    for (let key in Object.keys(config)) {
      if (stageKeys.indexOf(key) == -1) delete config[key]
    }
  }

  return stages.map(stage => {
    const stageId = getStageKey(stage);

    return {
      ...stage,
      config: config[stageId]
    }
  })
}
