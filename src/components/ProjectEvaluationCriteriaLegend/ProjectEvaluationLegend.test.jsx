import { render, screen, getByText } from '@testing-library/react'

import ProjectEvaluationCriteriaLegend from './ProjectEvaluationCriteriaLegend'

const dummyCriteria = [
  { id: 'xxx-1', name: 'XXX-1', weight: 25, type: 'competency' },
  { id: 'xxx-2', name: 'XXX-2', weight: 25, type: 'competency' },
  { id: 'xxx-3', name: 'XXX-3', weight: 25, type: 'competency' },
  { id: 'xxx-4', name: 'XXX-4', weight: 25, type: 'competency' }
]

describe('ProjectEvaluationCriteriaLegend', () => {
  it('should list criterias', () => {
    render(<ProjectEvaluationCriteriaLegend criteria={dummyCriteria} />)

    expect(screen.getByText('XXX-1', {exact: false})).toHaveTextContent('25% XXX-1')
    expect(screen.getByText('XXX-2', {exact: false})).toHaveTextContent('25% XXX-2')
    expect(screen.getByText('XXX-3', {exact: false})).toHaveTextContent('25% XXX-3')
    expect(screen.getByText('XXX-4', {exact: false})).toHaveTextContent('25% XXX-4')
  })
})
