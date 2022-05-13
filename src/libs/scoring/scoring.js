import { getInterviewAggregate } from 'libs/interview';

const scoreTable = [0, 25, 50, 75, 100]

export const calcInterviewScore = (interview, { scoringRules }) => {
  const aggregate = getInterviewAggregate(interview)

  let interviewScore = 0;

  const criteriaEvaluations = [
    ...Object.values(aggregate.competency).reduce((a, c) => [...a, ...c], []),
    ...Object.values(aggregate.experience).reduce((a, c) => [...a, ...c], [])
  ]

  for (let i = 0; i < criteriaEvaluations.length; i++) {
    const { criteria, score, subtype } = criteriaEvaluations[i]

    const p = (scoringRules[criteria.id] || 0) / aggregate[subtype][criteria.id].length;

    const localScore = scoreTable[score-1] * (p / 100);

    interviewScore += localScore
  }

  const categoryEvaluations = [
    ...aggregate['hard-skill'],
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
