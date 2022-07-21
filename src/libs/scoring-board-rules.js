export const COMPETENCY_RULES = [{
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

export const EXPERIENCE_RULES = [{
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

export const MOTIVATION_RULES = [{
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

export const CULTURE_FIT_RULES = [{
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

export const HARD_SKILL_RULES = [
    {
        name: 'Novice',
        steps: [
            `<ul>
        <li>Limited understanding of skill.</li>
        <li>Lacks context and perspective</li>
        <li>Mainly theoretical and little real-life experience</li>
        <li>Makes decisions based on data only without consideration</li>
      </ul>`
        ]
    },
    {
        name: 'Beginner',
        steps: [
            `<ul>
        <li>Theoretical understanding of skill</li>
        <li>Can use the context to advantage to some solve problems</li>
        <li>Some real life experiences</li>
        <li>May have a hard time knowing how to prioritize</li>
      </ul>`
        ]
    },
    {
        name: 'Competent',
        steps: [
            `<ul>
        <li>Great theoretical understanding</li>
        <li>Use context to advantage to and applies relevant problem solving</li>
        <li>Lots of experience</li>
        <li>Plan and work deliberately on their own</li>
      </ul>`
        ]
    },
    {
        name: 'Proficient',
        steps: [
            `<ul>
        <li>Excellent theoretical understanding</li>
        <li>Intuitively know how to solve problems</li>
        <li>Great amount of experience</li>
        <li>Holisitc view and can prioritize with ease</li>
      </ul>`
        ]
    },
    {
        name: 'Master',
        steps: [
            `<ul>
        <li>Immense theoretical understanding</li>
        <li>Intuitively know what how prioritize to solve problems</li>
        <li>Applies relevant pieces of skill regardless of context</li>
        <li>Holistic view and intuitive decision making</li>
      </ul>`
        ]
    }
]