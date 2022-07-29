import { DEFAULT_STAGE_TIME } from 'libs/config';

export const getStageKey = s => `${s.id}_${s.uid}`

export const getStageTime = stage => {
    if (stage && stage.config && stage.config.questions && !stage.time) {
        return Number.parseInt(stage.config.questions.length * 5 || DEFAULT_STAGE_TIME);
    }

    return Number.parseInt(stage.time || DEFAULT_STAGE_TIME);
}

export const SHORT_NAMES = {
    'team-role-presentation': 'Team & role',
    'company-presentation': 'Company',
    'salary': 'Salary',
    'candidate-questions': 'Candidate',
    'competency-questions': 'Competency',
    'motivation-questions': 'Motivation',
    'screening-questions': 'Screening',
    'experience-questions': 'Experience',
    'hard-skill-questions': 'Hard skill',
    'culture-questions': 'Culture',
    'introduction': 'Introduction',
    'summary': 'Summary',
    'other-questions': 'Other'
}

export const featureTypes = [
    { id: 'attraction', name: 'Attraction' },
    { id: 'evaluation', name: 'Evaluation' },
    { id: 'other', name: 'Other options' }
  ]

  export const SHORT_IDS = {
    'competency-questions': 'competency',
    'motivation-questions': 'motivation',
    'experience-questions': 'experience',
    'culture-questions': 'culture',
    'hard-skill-questions': 'hard-skill',
    'screening-questions': 'screening',
    'other-questions': 'other'
  }