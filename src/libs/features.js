export const featureTypes = [
  { id: 'attraction', name: 'Attraction' },
  { id: 'evaluation', name: 'Evaluation' },
  { id: 'other', name: 'Other options' }
]

export const features = [
  { id: 'company-presentation', name: 'Company presentation', type: 'attraction' },
  { id: 'salary', name: 'Salary', type: 'attraction' },
  { id: 'candidate-questions', name: 'Candidate questions', type: 'attraction' },
  { id: 'competency-questions', name: 'Competency based questions', shortName: 'Competency questions', type: 'evaluation', metadata: { criteria: 'competency' } },
  { id: 'motivation-questions', name: 'Motivation based questions', shortName: 'Motivation questions', type: 'evaluation', metadata: { criteria: 'motivation' } },
  { id: 'screening-questions', name: 'Screening questions', type: 'evaluation' },
  { id: 'experience-questions', name: 'Experience based questions', shortName: 'Experience questions', type: 'evaluation', metadata: { criteria: 'experience' } },
  { id: 'hard-skill-questions', name: 'Hard skill based questions', shortName: 'Hard skill questions', type: 'evaluation', metadata: { criteria: 'hard-skill' } },
  { id: 'culture-questions', name: 'Culture based questions', shortName: 'Culture questions', type: 'evaluation', metadata: { criteria: 'culture' }  },
  { id: 'introduction', name: 'Introduction', type: 'other' },
  { id: 'summary', name: 'Summary', type: 'other' },
  { id: 'other-questions', name: 'Other', type: 'other' }
]