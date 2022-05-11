import { calcInterviewScore } from './index';

const interview = {
    evaluations: {
      'competency': {
        'cq1': { score: 5, maxScore: 5, criteria: { id: 'criteria-x' } }
      },
      'motivation': {
        'mq1': { score: 1, maxScore: 5, subtype: 'subtype-x' }
      }
    }
}

const interview2 = {
    evaluations: {
      'competency': {
        'cq1': { score: 5, maxScore: 5, criteria: { id: 'M' } },
        'cq2': { score: 3, maxScore: 5, criteria: { id: 'M' } },
        'cq3': { score: 3, maxScore: 5, criteria: { id: 'R' } },
        'cq4': { score: 2, maxScore: 5, criteria: { id: 'R' } },
        'cq5': { score: 2, maxScore: 5, criteria: { id: 'S' } }
      }
    }
}

describe('scoring', () => {
  it('should score evaluation questions', () => {
    const project = {}

    expect(calcInterviewScore(interview, project)).toEqual(50);
  })

  it('should score evaluation questions using adjustment layer', () => {
    const project = {
      scoringRules: {
        'criteria-x': 20,
        'subtype-x': 80
      }
    }

    expect(calcInterviewScore(interview, project)).toEqual(20);
  })

  it('adjustment layer should not be affected by other or screening questions', () => {
    const project = {
      scoringRules: {
        'criteria-x': 12.8,
        'subtype-x': 51.2,
        'other': 18,
        'screening': 18
      }
    }

    expect(calcInterviewScore(interview, project)).toEqual(20);
  })

  it('should score evaluation questions (client example)', () => {
    const project = {
      scoringRules: {
        'M': 30,
        'R': 50,
        'S': 20
      }
    }

    expect(calcInterviewScore(interview2, project)).toEqual(46);
  })
})
