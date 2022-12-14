import {
  COMPETENCY_RULES_INT,
  EXPERIENCE_RULES_INT,
  MOTIVATION_RULES_INT,
  HARD_SKILL_RULES_INT,
  CULTURE_FIT_RULES_INT
} from 'libs/scoring-board-rules';

export const criteriaTypes = [
  {
    id: 'competency',
    name: 'Competency',
    altName: 'Competency based',
    cta: 'Create a new competency based question',
    desc: 'Aims to assess relevant competencies that are necessary to be high performing in the role. The competencies you choose should reflect behaviors that are critical in the role and be based on a job analysis.',
    rules: COMPETENCY_RULES_INT
  },
  {
    id: 'experience',
    name: 'Experience',
    altName: 'Experience based',
    cta: 'Create a new experience based question',
    desc: 'Aims to assess the candidate’s experience within relevant fields necessary to perform the job. These questions should heavily rely on the ad, job analysis and minimum requirements.',
    rules: EXPERIENCE_RULES_INT
  },
  {
    id: 'motivation',
    name: 'Motivation',
    altName: 'Motivation based',
    cta: 'Create a new motivation based question',
    desc: 'Aims to assess the candidate’s motivation for applying for the job. This could either be why they’ve applied for the, what motivated them to become a leader or if they are willing to move to take the job.',
    rules: MOTIVATION_RULES_INT
  },
  {
    id: 'culture',
    name: 'Culture',
    altName: 'Culture based',
    cta: 'Create a new culture question',
    desc: 'Aims to assess the candidate’s culture or team fit. Whether the candidate will fit in with the rest of the team or the organization.',
    rules: CULTURE_FIT_RULES_INT
  },
  {
    id: 'hard-skill',
    name: 'Hard skill',
    altName: 'Hard skill based',
    cta: 'Create a new hard skill based question',
    desc: 'Aims to assess whether the candidate possesses the necessary skills required for the position. Skills are learnt and can improve over time. They can be things such as being good at a specific program, knowing a foreign language or UI/UX design.',
    rules: HARD_SKILL_RULES_INT
  }
]

export const EVALUATION_CRITERIA_TYPES = {
  'competency': {
    name: 'Competency',
    desc: 'Aims to assess relevant competencies that are necessary to be high performing in the role. The competencies you choose should reflect behaviors that are critical in the role and be based on a job analysis.',
    rules: COMPETENCY_RULES_INT
  },
  'experience': {
    name: 'Experience',
    desc: 'Aims to assess the candidate’s experience within relevant fields necessary to perform the job. These questions should heavily rely on the ad, job analysis and minimum requirements.',
    rules: EXPERIENCE_RULES_INT
  },
  'motivation': {
    name: 'Motivation',
    desc: 'Aims to assess the candidate’s motivation for applying for the job. This could either be why they’ve applied for the, what motivated them to become a leader or if they are willing to move to take the job.',
    rules: MOTIVATION_RULES_INT
  },
  'culture': {
    name: 'Culture',
    desc: 'Aims to assess the candidate’s culture or team fit. Whether the candidate will fit in with the rest of the team or the organization.',
    rules: CULTURE_FIT_RULES_INT
  },
  'hard-skill': {
    name: 'Hard skill',
    desc: 'Aims to assess whether the candidate possesses the necessary skills required for the position. Skills are learnt and can improve over time. They can be things such as being good at a specific program, knowing a foreign language or UI/UX design.',
    rules: HARD_SKILL_RULES_INT
  }
}

export const getCriteriaTypeById = id => {
  return criteriaTypes.find(ct => ct.id == id);
}

export const flattenCriteriaTree = (criteria, key = 'weight') => {
  const criteriaMap = {}

  for (let i = 0; i < criteria.length; i++) {
    const { type, children } = criteria[i];

    if (children) {
      for (let k = 0; k < children.length; k++) {
        const { type } = children[k];

        criteriaMap[type] = children[k][key];
      }
    } else {
      criteriaMap[type] = criteria[i][key];
    }
  }

  return criteriaMap;
}
