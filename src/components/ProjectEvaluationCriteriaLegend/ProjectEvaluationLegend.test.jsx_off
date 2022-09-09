import { render, screen, getByText, getByRole } from '@testing-library/react'

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

    const competencyRoot = competency.closest('[data-test-id="criteria-legend"]')

    expect(
      getByText(competencyRoot, 'XXX', {exact: false}).closest('li')
    ).toHaveTextContent('50%')

    expect(
      getByText(competencyRoot, 'YYY', {exact: false}).closest('li')
    ).toHaveTextContent('40%')

    competency.click()

    expect(getByRole(competencyRoot, 'list', { hidden: true })).not.toBeVisible()

    expect(screen.getByText('Motivation', {exact: false}).closest("div")).toHaveTextContent('10%')
  })
})
