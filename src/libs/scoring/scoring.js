export const calcInterviewScore = (interview, project) => {
  const { evaluations } = interview;
  const { scoringRules } = project;

  if (!evaluations) {
    return 0;
  }

  //Evaluation scores
  let score = 0;
  let total = 0;

  //Evaluation makes a percentage of questions
  let evaluationP = 100;

  if (scoringRules && scoringRules['other']) {
    evaluationP -= Number.parseFloat(scoringRules['other']);
  }

  if (scoringRules && scoringRules['screening']) {
    evaluationP -= Number.parseFloat(scoringRules['screening']);
  }

  console.log(scoringRules)

  const stages = Object.values(evaluations)

  for (let s = 0; s < stages.length; s++) {
    const evaluations = Object.values(stages[s])

    for (let i = 0; i < evaluations.length; i++) {
      if (typeof evaluations[i].score !== "undefined") {
        let maxScore = evaluations[i].maxScore || evaluations[i].score;

        let cof = 1;

        if (scoringRules) {
          const id = evaluations[i].criteria && evaluations[i].criteria.id;
          const key = id || evaluations[i].subtype;

          if (typeof scoringRules[key] !== "undefined") {
            const p = scoringRules[key];

            cof = Number.parseFloat(p) / evaluationP;
          }
        }

        score += evaluations[i].score / maxScore * cof;

        total++;
      }
    }
  }

  return Math.round(score * 100 / total);
}
