export const featureTypes = [
  {
    id: 'structure',
    name: 'Structure',
    features: [
      { id: 'introduction', name: 'Introduction', type: 'structure' },
      { id: 'summary', name: 'Summary', type: 'structure' }
    ]
  },
  {
    id: 'evaluation',
    name: 'Evaluation',
    features: [
      { id: 'competency-questions', name: 'Competency', desc: 'Competency questions', type: 'evaluation', subtype: 'competency', criteria: true },
      { id: 'experience-questions', name: 'Experience', desc: 'Experience questions', type: 'evaluation', subtype: 'experience', criteria: true },
      { id: 'hard-skill-questions', name: 'Hard skill', desc: 'Hard skill questions', type: 'evaluation', subtype: 'hard-skill', criteria: true },
      { id: 'culture-questions', name: 'Culture', desc: 'Culture questions', type: 'evaluation', subtype: 'culture', criteria: false },
      { id: 'motivation-questions', name: 'Motivation', desc: 'Motivation questions', type: 'evaluation', subtype: 'motivation', criteria: false },
      { id: 'screening-questions', name: 'Screening', desc: 'Screening questions', type: 'evaluation', subtype: 'screening' }
    ]
  },
  {
    id: 'attraction',
    name: 'Attraction',
    features: [
      { id: 'company-presentation', name: 'Company', type: 'attraction' },
      { id: 'salary', name: 'Salary', type: 'attraction' },
      { id: 'candidate-questions', name: 'Candidate', type: 'attraction' },
      { id: 'other-questions', name: 'Other', type: 'attraction' }
    ]
  }
]

export const features = [
  ...featureTypes[0].features,
  ...featureTypes[1].features,
  ...featureTypes[2].features
]

export const getFeatureById = id => features.find(f => f.id == id);
