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

describe('scoring', () => {
  it('should score evaluation questions', () => {
    const project = {}

    expect(calcInterviewScore(interview, project)).toEqual(60);
  })

  it('should score evaluation questions using adjustment layer', () => {
    const project = {
      scoringRules: {
        'criteria-x': 20,
        'subtype-x': 80
      }
    }

    expect(calcInterviewScore(interview, project)).toEqual(18);
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

    expect(calcInterviewScore(interview, project)).toEqual(18);
  })
})
