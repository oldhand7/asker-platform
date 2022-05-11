describe('Scoring', () => {
  beforeEach(() => {
    cy.login('joe.kaunas@example.com', 'test123')
    cy.viewport(1200, 800)
  })

  it('should score with atjusted layer', () => {
    cy.on('window:confirm', () => true)

    cy.createEvaluationCriteriaQuestion('competency', { name: 'Are you familiar with ISO standards?', criteria: 'ISO-90210' });
    cy.createEvaluationQuestion('motivation', { name : 'Does money motivate you?'});

    cy.createDummyProject('Some position')

    // cy.visit('/')
    cy.tableFirstRowNavigate('Edit');

    cy.get('[data-test-id="stage-2"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Competency').click().wait(2000)
    cy.get('[data-test-id="feature-form"]')
      .find('table tbody tr')
      .first()
      .find('button')
      .click()

    cy.get('[data-test-id="stage-3"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Motivation').click().wait(2000)
    cy.get('[data-test-id="feature-form"]')
      .find('table tbody tr')
      .first()
      .find('button')
      .click()

    cy.contains('Evaluation Criteria').parent()
      .should('contain', '50% Motivation')
      .should('contain', '50% ISO-90210')
      .contains('Edit')
      .click()

    cy.get('[role="dialog"]')
      .within(() => {
        cy.contains('ISO-90210').closest('tr').find('input').type('{selectAll}{backspace}20')
        cy.contains('Motivation').closest('tr').find('input').type('{selectAll}{backspace}80')

        cy.contains('Save').click()
      })

    cy.contains('Evaluation Criteria').parent()
      .should('contain', '80% Motivation')
      .should('contain', '20% ISO-90210')

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').contains('Project saved')

    cy.get('table tbody tr').first().click()

    cy.addProjectCandidate('John Smith', 'john.smith@hotmail.net')
      .wait(4000)

    cy.contains('John Smith')
      .closest('tr')
      .contains('Start interview')
      .click()


    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'Competency')
      .should('contain', 'ISO-90210')
      .should('contain', 'Are you familiar with ISO standards?')
      .contains('Excellent').click()

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'Motivation')
      .should('contain', 'Does money motivate you?')
      .contains('Not motivated').click()

    cy.contains('Complete interview').click()

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(1).should('contain', '18%')

        cy.get('[data-test-id="evaluation-score"]').eq(0)
          .should('have.attr', 'data-score', '5')
          .should('contain', 'ISO-90210')

        cy.get('[data-test-id="evaluation-score"]').eq(1)
          .should('have.attr', 'data-score', '1')
          .should('contain', 'Motivation')
      })
  })
})
