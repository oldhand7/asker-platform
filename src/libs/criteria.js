export const criteriaTypes = [{
    id: 'competency',
    name: 'Competency',
    altName: 'Competency based',
    cta: 'Create a new competency based question',
    desc: 'Aims to assess relevant copetencies that are necessary to be high performing in the role. The compencies you choose should reflect behaviors that are critical in the role and be based on a job analysis.',
    rules: [{
        name: 'Unsatisfactory',
        steps: ['', '', '']
      },
      {
        name: 'Fair',
        steps: null
      },
      {
        name: 'Good',
        steps: ['', '', '']
      },
      {
        name: 'Great',
        steps: null
      },
      {
        name: 'Excellent',
        steps: ['', '', '']
      }
    ]
  },
  {
    id: 'experience',
    name: 'Experience',
    altName: 'Experience based',
    cta: 'Create a new experience based question',
    desc: 'Aims to assess the candidates experience within relevant fields necessary to perform the job. Whether the candidate has related experience in job, function, industry and geography as the ones required for the job. These questions should heavily rely on the ad, job analysis and minimum requirements.',
    rules: [{
        name: 'No experience',
        steps: null
      },
      {
        name: 'Little experience',
        steps: null
      },
      {
        name: 'Experienced',
        steps: null
      },
      {
        name: 'Very experienced',
        steps: null
      },
      {
        name: 'Extensively experienced',
        steps: null
      }
    ]
  },
  {
    id: 'motivation',
    name: 'Motivation',
    altName: 'Motivation based',
    cta: 'Create a new motivation based question',
    desc: 'Aims to assess the candidates motivation for applying for the job. This could be either why they have applied, what motivated them to become a leader or if they are willing to move to take the job.',
    rules: [{
        name: 'Not motivated',
        steps: null
      },
      {
        name: 'Slightly motivated',
        steps: null
      },
      {
        name: 'Motivated',
        steps: null
      },
      {
        name: 'Highly motivated',
        steps: null
      },
      {
        name: 'Extremely motivated',
        steps: null
      }
    ]
  },
  {
    id: 'culture-fit',
    name: 'Culture-fit',
    altName: 'Culture-fit based',
    cta: 'Create a new culture-fit question',
    desc: 'Aims to assess the candidates culture or team fit. Whether the candidate will fit in with the rest of the team or the organization as a whole.',
    rules: [{
        name: 'Very low fit',
        steps: null
      },
      {
        name: 'Low fit',
        steps: null
      },
      {
        name: 'Average fit',
        steps: null
      },
      {
        name: 'High fit',
        steps: null
      },
      {
        name: 'Very high fit',
        steps: null
      }
    ]
  },
  {
    id: 'hard-skill',
    name: 'Hard skill',
    altName: 'Hard skill based',
    cta: 'Create a new hard skill based question',
    desc: 'Aims to assess wheter the candidate possesses the necessary skills required for the position. Skills are things that are learnt and can improve over time. They can be things such as being good at a specific program, knowing a foreign language or UI/UX design. ',
    rules: [{
        name: 'Novice',
        steps: [
          'Limited understanding of skill.',
          'Lacks context and perspective',
          'Mainly theoretical and little real-life experience',
          'Makes decisions based on data only without consideration'
        ]
      },
      {
        name: 'Beginner',
        steps: [
          'Makes decisions based on data only without consideration',
          'Can use the context to advantage to some solve problems',
          'Some real life experiences',
          'May have a hard time knowing how to prioritize'
        ]
      },
      {
        name: 'Competent',
        steps: [
          'Great theoretical understanding',
          'Uses context to advantage and applies relevant problem solving',
          'Lots of experience',
          'Plan and work deliberately on their own'
        ]
      },
      {
        name: 'Proficient',
        steps: [
          'Excellent theoretical understanding',
          'Intuitively know how to solve problems',
          'Great amount of experience',
          'Holisitc view and can prioritize with ease'
        ]
      },
      {
        name: 'Master',
        steps: [
          'Immense theoretical understanding',
          'Intuitively know what how prioritize to solve problems',
          'Applies relevant pieces of skill regardless of context',
          'Holistic view and intuitive decision making'
        ]
      }
    ]
  }
]

export const getCriteriaTypeById = id => {
  return criteriaTypes.find(ct => ct.id == id);
}
