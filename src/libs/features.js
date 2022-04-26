export const featureTypes = [
  { id: 'attraction', name: 'Attraction' },
  { id: 'evaluation', name: 'Evaluation' },
  { id: 'other', name: 'Other options' }
]

export const features = [
  { id: 'team-role-presentation', name: 'Team & role presentation', type: 'attraction' },
  { id: 'company-presentation', name: 'Company presentation', type: 'attraction' },
  { id: 'salary', name: 'Salary', type: 'attraction' },
  { id: 'candidate-questions', name: 'Candidate questions', type: 'attraction' },
  { id: 'competency-questions', name: 'Competency based questions', type: 'evaluation', metadata: { criteria: 'competency' } },
  { id: 'motivation-questions', name: 'Motivation based questions', type: 'evaluation', metadata: { criteria: 'motivation' } },
  // { id: 'screening-questions', name: 'Screening questions', type: 'evaluation' },
  { id: 'experience-questions', name: 'Experience based questions', type: 'evaluation', metadata: { criteria: 'experience' } },
  { id: 'hard-skill-questions', name: 'Hard skill based questions', type: 'evaluation', metadata: { criteria: 'hard-skill' } },
  { id: 'culture-fit-questions', name: 'Culture-fit based questions', type: 'evaluation', metadata: { criteria: 'culture-fit' }  },
  // { id: 'summary', name: 'Summary', type: 'other' },
  // { id: 'others', name: 'Others', type: 'other' }
]
