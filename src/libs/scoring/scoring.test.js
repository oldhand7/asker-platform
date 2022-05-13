import { calcInterviewScore } from './index';

const interview1 = {
    evaluations: {
      'competency-questions': {
        'cq1': { score: 5, subtype: 'competency', criteria: { id: 'Stress tolerance' } }
      },
      'motivation-questions': {
        'mq1': { score: 1, subtype: 'motivation' }
      }
    }
}

const interview2a = {
    evaluations: {
      'competency-questions': {
        'cq1': { score: 5, subtype: 'competency', criteria: { id: 'Stress tolerance' } }
      },
      'motivation-questions': {
        'mq1': { score: 1, subtype: 'motivation' }
      }
    }
}

const interview2b = {
    evaluations: {
      'competency-questions': {
        'cq1': { score: 3, subtype: 'competency', criteria: { id: 'Stress tolerance' } }
      },
      'motivation-questions': {
        'mq1': { score: 4, subtype: 'motivation' }
      }
    }
}

const interview3 = {
    evaluations: {
      'competency-questions': {
        'cq1': { score: 2, subtype: 'competency', criteria: { id: 'Stress tolerance', name: 'Stress tolerance' } },
        'cq2': { score: 3, subtype: 'competency', criteria: { id: 'Result oriented', name: 'Result oriented' } },
        'cq3': { score: 5, subtype: 'competency', criteria: { id: 'Proactive', name: 'Proactive' } },
        'cq4': { score: 5, subtype: 'competency', criteria: { id: 'Problem Solving', name: 'Problem Solving' } }
      },
      'motivation-questions': {
        'mq1': { score: 5, subtype: 'motivation' }
      },
      'hard-skill-questions': {
        'hsq1': { score: 5,  subtype: 'hard-skill', criteria: { id: 'CRM', name: 'CRM' } }
      },
      'experience-questions': {
        'eq1': { score: 5,  subtype: 'experience', criteria: { id: 'Leadership experience', name: 'Leadership experience' } }
      }
    }
}

describe('scoring', () => {
  it('interview 1', () => {
    const project = {
      scoringRules: {
        'Stress tolerance': 50,
        'motivation': 50
      }
    }

    expect(calcInterviewScore(interview1, project)).toEqual(50);
  })

  it('interview 2a', () => {
    const project = {
      scoringRules: {
        'Stress tolerance': 20,
        'motivation': 80
      }
    }

    expect(calcInterviewScore(interview2a, project)).toEqual(20);
  })


  it('interview 2b', () => {
    const project = {
      scoringRules: {
        'Stress tolerance': 20,
        'motivation': 80
      }
    }

    expect(calcInterviewScore(interview2b, project)).toEqual(70);
  })

  it('should score evaluation questions (client example)', () => {
    const project = {
      scoringRules: {
        'Stress tolerance': 15,
        'Result oriented': 20,
        'Proactive': 15,
        'Problem Solving': 15,
        'motivation': 10,
        'hard-skill': 5,
        'Leadership experience': 20
      }
    }

    expect(calcInterviewScore(interview3, project)).toEqual(79);
  })
})
