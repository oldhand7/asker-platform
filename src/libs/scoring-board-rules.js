const EMPTY_INT = { en: ''}

export const COMPETENCY_RULES_INT = [{
  name: {
    en: 'Unsatisfactory'
  },
  steps: [EMPTY_INT, EMPTY_INT, EMPTY_INT]
},
{
  name: {
    en: 'Fair'
  },
  steps: []
},
{
  name: {
    en: 'Good'
  },
  steps: [EMPTY_INT, EMPTY_INT, EMPTY_INT]
},
{
  name: {
    en: 'Great'
  },
  steps: []
},
{
  name: {
    en: 'Excellent'
  },
  steps: [EMPTY_INT, EMPTY_INT, EMPTY_INT]
}
]

export const EXPERIENCE_RULES_INT = [{
  name: {
    en: 'No experience'
  },
  steps: []
},
{
  name: {
    en: 'Little experience'
  },
  steps: []
},
{
  name: {
    en: 'Experienced'
  },
  steps: []
},
{
  name: {
    en: 'Very experienced'
  },
  steps: []
},
{
  name: {
    en: 'Extensively experienced'
  },
  steps: []
}
]

export const MOTIVATION_RULES_INT = [{
  name: {
    en: 'Not motivated'
  },
  steps: []
},
{
  name: {
    en: 'Slightly motivated'
  },
  steps: []
},
{
  name: {
    en: 'Motivated'
  },
  steps: []
},
{
  name: {
    en: 'Highly motivated'
  },
  steps: []
},
{
  name: {
    en: 'Extremely motivated'
  },
  steps: []
}
]

export const CULTURE_FIT_RULES_INT = [{
  name: {
    en: 'Very low fit'
  },
  steps: []
},
{
  name: {
    en: 'Low fit'
  },
  steps: []
},
{
  name: {
    en: 'Average fit'
  },
  steps: []
},
{
  name: {
    en: 'High fit'
  },
  steps: []
},
{
  name: {
    en: 'Very high fit'
  },
  steps: []
}
]

export const HARD_SKILL_RULES_INT = [
  {
      name: {
        en: 'Novice'
      },
      steps: [
        { en:  `<ul>
        <li>Limited understanding of skill.</li>
        <li>Lacks context and perspective</li>
        <li>Mainly theoretical and little real-life experience</li>
        <li>Makes decisions based on data only without consideration</li>
      </ul>`}
      ]
  },
  {
      name: { en: 'Beginner'},
      steps: [
          { en: `<ul>
          <li>Theoretical understanding of skill</li>
          <li>Can use the context to advantage to some solve problems</li>
          <li>Some real life experiences</li>
          <li>May have a hard time knowing how to prioritize</li>
        </ul>`}
      ]
  },
  {
      name: { en: 'Competent'},
      steps: [
          { en: `<ul>
          <li>Great theoretical understanding</li>
          <li>Use context to advantage to and applies relevant problem solving</li>
          <li>Lots of experience</li>
          <li>Plan and work deliberately on their own</li>
        </ul>`}
      ]
  },
  {
      name: { en: 'Proficient'},
      steps: [
          { en: `<ul>
          <li>Excellent theoretical understanding</li>
          <li>Intuitively know how to solve problems</li>
          <li>Great amount of experience</li>
          <li>Holisitc view and can prioritize with ease</li>
        </ul>`}
      ]
  },
  {
      name: { en: 'Master'},
      steps: [
          { en: `<ul>
          <li>Immense theoretical understanding</li>
          <li>Intuitively know what how prioritize to solve problems</li>
          <li>Applies relevant pieces of skill regardless of context</li>
          <li>Holistic view and intuitive decision making</li>
        </ul>`}
      ]
  }
]