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

  const stages = Object.values(evaluations)

  const stat = {}

  for (let s = 0; s < stages.length; s++) {
    const evaluations = Object.values(stages[s])

    for (let i = 0; i < evaluations.length; i++) {
      if (typeof evaluations[i].score !== "undefined") {
        const id = evaluations[i].criteria && evaluations[i].criteria.id;
        const key = id || evaluations[i].subtype;

        if (!stat[key]) {
          stat[key] = 1
        } else {
          stat[key]++
        }
      }
    }
  }

  for (let s = 0; s < stages.length; s++) {
    const evaluations = Object.values(stages[s])

    for (let i = 0; i < evaluations.length; i++) {
      if (typeof evaluations[i].score !== "undefined") {
        let maxScore = evaluations[i].maxScore || evaluations[i].score;

        let cof = 1;

        if (scoringRules) {
          const id = evaluations[i].criteria && evaluations[i].criteria.id;
          const key = id || evaluations[i].subtype;

          if (typeof scoringRules[key] !== "undefined" && stat[key]) {
            const p = scoringRules[key];

            cof = Number.parseFloat(p) / stat[key] / evaluationP;
          }
        }

        if (evaluations[i].score > 1) {
          // 2 - 0.25
          // 3 - 0.5
          // 4 - 0.75
          // 5 - 1
          score += (evaluations[i].score - 1) / (maxScore - 1) * cof;
        } else {
          score += 0;
        }

        total++;
      }
    }
  }

  return scoringRules ? Math.round(score * 100) : Math.round(score * 100 / total);
}
