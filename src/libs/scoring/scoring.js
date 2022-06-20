import { getInterviewAggregate } from 'libs/interview';
import { fixFloat } from 'libs/helper';

const scoreTable = [0, 25, 50, 75, 100]

const scoreReducer = (sum, { score }) => {
  return Number.parseInt(score || 0) + sum;
}

const nameSort = function(a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

  return 0;
}

export const calcInterviewScore = (interview, { scoringRules }) => {
  const aggregate = getInterviewAggregate(interview)

  let interviewScore = 0;

  const criteriaEvaluations = [
    ...Object.values(aggregate.competency).reduce((a, c) => [...a, ...c], []),
    ...Object.values(aggregate.experience).reduce((a, c) => [...a, ...c], []),
    ...Object.values(aggregate['hard-skill']).reduce((a, c) => [...a, ...c], [])
  ]

  for (let i = 0; i < criteriaEvaluations.length; i++) {
    const { criteria, score, subtype } = criteriaEvaluations[i]

    const p = (scoringRules[criteria.id] || 0) / aggregate[subtype][criteria.id].length;

    const localScore = scoreTable[score-1] * (p / 100);

    interviewScore += localScore
  }

  const categoryEvaluations = [
    ...aggregate['culture-fit'],
    ...aggregate['motivation']
  ]

  for (let i = 0; i < categoryEvaluations.length; i++) {
    const { subtype, score } = categoryEvaluations[i]
    const p = (scoringRules[subtype] || 0) / aggregate[subtype].length;

    const localScore = scoreTable[score-1] * (p / 100);

    interviewScore += localScore
  }

  return Math.round(interviewScore);
}

export const scoreMap = (interview, { scoringRules }) => {
  const aggregate = getInterviewAggregate(interview)

  const table = {
    'competency': {
      score: 0,
      name: 'Competency',
      children: [],
      type: 'competency'
    },
    'experience': {
      score: 0,
      name: 'Experience',
      children: [],
      type: 'experience'
    },
    'hard-skill': {
      score: 0,
      name: 'Hard-skill',
      children: [],
      type: 'hard-skill'
    },
    'motivation': {
      score: 0,
      name: 'Motivation',
      children: null,
      type: 'motivation'
    },
    'culture-fit': {
      score: 0,
      name: 'Culture-fit',
      children: null,
      type: 'culture-fit'
    }
  }

  for (const key in table) {
    if (!table[key].children) {
      if (!aggregate[key].length) continue;

      const { subtype } = aggregate[key][0]

      let localScore = 0;

      for (let i = 0; i < aggregate[key].length; i++) {
        const { score } = aggregate[key][i];

        const p = (scoringRules[subtype] || 0) / aggregate[key].length;
        localScore += scoreTable[score-1] * (p / 100);
      }

      table[key].score = Math.round(localScore);
    } else {
      let score = 0;

      for (const cid in aggregate[key]) {
        const { criteria } = aggregate[key][cid][0]

        let localScore = 0;

        for (let i = 0; i < aggregate[key][cid].length; i++) {
            const { score } = aggregate[key][cid][i];

            const p = (scoringRules[cid] || 0) / aggregate[key][cid].length;

            localScore += scoreTable[score-1] * (p / 100);
        }

        const cScore = Math.round(
          aggregate[key][cid].reduce(scoreReducer, 0) / aggregate[key][cid].length
        )

        table[key].children.push({
          id: cid,
          name: criteria.name,
          score: cScore,
          type: criteria.type
        })

        score += localScore;
      }


      table[key].children.sort(nameSort);
      table[key].score = Math.round(score);
    }
  }

  return table;
}
