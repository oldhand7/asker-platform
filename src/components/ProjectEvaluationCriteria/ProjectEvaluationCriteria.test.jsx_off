import { render, screen, getByText, getByRole } from '@testing-library/react'
import ProjectEvaluationCriteria from './ProjectEvaluationCriteria'
import { withModal } from 'libs/modal'

const demoProject = {
  stages: [
    { id: 'aaa', config: {
      questions: [
        { type: 'screening', subtype: 'text' }
      ]
    } },
    { id: 'bbb', config: {
      questions: [
        { type: 'other', subtype: 'text' }
      ]
    } },
    { id: 'ccc', config: {
      questions: [
        { type: 'evaluation', subtype: 'motivation' }
      ]
    } },
    { id: 'ddd', config: {
      questions: [
        { type: 'evaluation', subtype: 'culture' }
      ]
    } },
    { id: 'eee', config: {
      questions: [
        { type: 'evaluation', subtype: 'experience', criteria: { id: 'trav', name: 'Traveling' } },
        { type: 'evaluation', subtype: 'experience', criteria: { id: 'trav', name: 'Traveling' } },
        { type: 'evaluation', subtype: 'experience', criteria: { id: 'trav', name: 'Traveling' } }
      ]
    } }
  ]
}

describe('ProjectEvaluationCriteria', () => {
  it('should have a list of evaluations sorted by Z-A', () => {

    const ProjectEvaluationCriteriaWithModa = withModal(ProjectEvaluationCriteria)

    render(<ProjectEvaluationCriteriaWithModa project={demoProject} />)

    const experienceCriteria = screen.getByText('Experience', {exact: false}).closest('div')
    expect(experienceCriteria).toHaveTextContent('60%')
    const experienceCriteriaRoot = experienceCriteria.closest('[data-test-id="criteria-legend"]')
    expect(getByRole(experienceCriteriaRoot, 'listitem')).toHaveTextContent('Traveling')
    expect(getByRole(experienceCriteriaRoot, 'listitem')).toHaveTextContent('60%')

    expect(screen.getByText('Motivation', {exact: false}).closest('div')).toHaveTextContent('20%')
    expect(screen.getByText('Culture', {exact: false}).closest('div')).toHaveTextContent('20%')
  })
})
