import { features } from 'libs/features';
import { isMultistage } from 'libs/stage';
import { EVALUATION_CRITERIA_TYPES } from 'libs/criteria';

export const getInterviewAggregate = ({ evaluations }) => {
  const aggregate = {
    competency: {},
    experience: {},
    'hard-skill': {},
    motivation: [],
    'culture': []
  }

  for (const eKey in evaluations) {
    const [stageId] = eKey.split('_');

    const feature = features.find(f => {
      return f.id == stageId && typeof f.criteria !== "undefined";
    })

    if (!feature) {
      continue;
    }

    if (feature.criteria) {
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
      const id = feature.subtype || feature.id; 

      aggregate[id] = [
        ...aggregate[id],
        ...Object.values(evaluations[eKey])
      ]
    }
  }

  return aggregate;
}

export const createStats = (stages = [], prevStats) => {
  const stats = [];

  for (let i = 0; i < stages.length; i++) {
    const { id, uid, config, name } = stages[i];

    const key = `${id}_${uid}`;

    if (isMultistage(stages[i])) {
      const { questions } = config || {};

      for (let k = 0; k < (questions || []).length; k++) {
        const { id, criteria, name, subtype } = questions[k];

        const oldStat = (prevStats || []).find(stat => stat.id == key && stat.questionId == id)

        if (oldStat) {
          stats.push(oldStat)
        } else {
          stats.push({
            id: key,
            questionId: id,
            name: criteria ? criteria.name : EVALUATION_CRITERIA_TYPES[subtype].name,
            hint: name,
            status: 'awaiting',
            questions: 1,
            time: 0
          })
        }
      }
    } else {
      let hint = name;

      if (config && config.questions) {
        hint = `${config.questions.length} questions`
      }

      const oldStat = (prevStats || []).find(stat => stat.id == key)

      if (oldStat) {
        stats.push(oldStat)
      } else {
        stats.push({
          id: key,
          name,
          status: 'awaiting',
          hint,
          questions: (config && config.questions || []).length,
          time: 0
        })
      }
    }
  }

  return stats;
}