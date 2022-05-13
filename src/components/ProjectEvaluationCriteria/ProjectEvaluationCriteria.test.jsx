import { render, screen, getByText } from '@testing-library/react'
import ProjectEvaluationCriteria from './ProjectEvaluationCriteria'
import { withModal } from 'libs/modal'

const demoProject = {
  stages: [
    { id: 'aaa' },
    { id: 'bbb' },
    { id: 'ccc' },
    { id: 'ddd' },
    { id: 'eee' }
  ],
  config: {
    aaa: {
      questions: [
        { type: 'screening', subtype: 'text' }
      ]
    },
    bbb: {
      questions: [
        { type: 'other', subtype: 'text' }
      ]
    },
    ccc: {
      questions: [
        { type: 'evaluation', subtype: 'motivation' }
      ]
    },
    ddd: {
      questions: [
        { type: 'evaluation', subtype: 'culture-fit' }
      ]
    },
    eee: {
      questions: [
        { type: 'evaluation', subtype: 'experience', criteria: { id: 'trav', name: 'Traveling' } },
        { type: 'evaluation', subtype: 'experience', criteria: { id: 'trav', name: 'Traveling' } },
        { type: 'evaluation', subtype: 'experience', criteria: { id: 'trav', name: 'Traveling' } }
      ]
    }
  }
}

describe('ProjectEvaluationCriteria', () => {
  it('should have a list of evaluations sorted by Z-A', () => {

    const ProjectEvaluationCriteriaWithModa = withModal(ProjectEvaluationCriteria)

    render(<ProjectEvaluationCriteriaWithModa project={demoProject} />)

    expect(screen.getByText('Traveling', {exact: false})).toHaveTextContent('60% Traveling')
    expect(screen.getByText('Motivation', {exact: false})).toHaveTextContent('20% Motivation')
    expect(screen.getByText('Culture-fit', {exact: false})).toHaveTextContent('20% Culture-fit')
  })
})
