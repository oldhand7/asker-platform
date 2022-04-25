import { criteriaTypes } from 'libs/criteria'

export const questionTypes = [
  {
    id: 'evaluation',
    name: 'Evaluation',
    subtypes: [...criteriaTypes],
    defaultSubtype: 0
  },
  {
    id: 'screening',
    name: 'Screening',
    cta: 'Create a new screening question',
    desc: 'Aims to check whether the candidate has the absolute minimum requirements needed for the job, such as driver’s license, education or years of experience. The questions should aim to assess things that are deemed absolutely critical for the role.'
  },
  {
    id: 'other',
    name: 'Other'
  }
]

export const getQuestionTypeById = id => {
  return questionTypes.find(ct => ct.id == id);
}
