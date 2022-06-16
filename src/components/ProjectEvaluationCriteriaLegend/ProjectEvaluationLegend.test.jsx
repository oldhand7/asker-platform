import { render, screen, getByText } from '@testing-library/react'

import ProjectEvaluationCriteriaLegend from './ProjectEvaluationCriteriaLegend'

const dummyCriteria = [
  { name: 'Competency', weight: 90, type: 'competency', children: [
    { name: 'XXX', weight: 50, type: 'xxx' },
    { name: 'YYY', weight: 40, type: 'yyy' },
  ] },
  { name: 'Motivation', weight: 10, type: 'motivation' }
]

describe('ProjectEvaluationCriteriaLegend', () => {
  it('should list criterias', () => {
    render(<ProjectEvaluationCriteriaLegend criteria={dummyCriteria} />)

    const competency  = screen.getByText('Competency', {exact: false}).closest("div")

    expect(competency).toHaveTextContent('90%')

    competency.click()

    //@TODO: within
    expect(screen.getByText('XXX').closest('li')).toHaveTextContent('50%')
    expect(screen.getByText('YYY').closest('li')).toHaveTextContent('40%')

    expect(screen.getByText('Motivation', {exact: false}).closest("div")).toHaveTextContent('10%')
  })
})
