Cypress.Commands.add('createTextQuestion', (name = 'Demo ABC', desc = '') => {
  cy.visit('/questions/create/screening')

  cy.contains('Text').click()

  cy.get('[data-test-id="text-question-form"]')
    .within(() => {
      cy.get('input[name="name"]').type(name)

      if (desc) {
        cy.get('textarea[name="desc"]').type(desc)
      }

      cy.contains('Create question').click()
    })

    cy.get('[data-test-id="alert-success"]').should('contain', 'Question created');
})

Cypress.Commands.add('createEvaluationQuestion', (type = 'motivation', details) => {
  cy.visit(`/questions/create/evaluation/?subtype=${type}`)

  cy.get('form[data-test-id="evaluation-question-form"]')
    .within(() => {
      cy.get('input[name="name"]').first().type(details.name || 'What motivates you?')
    })

  cy.get('button[type="submit"]').should('contain', 'Add question').click()

  cy.get('[data-test-id="alert-success"]').should('contain', 'Question created')
})

Cypress.Commands.add('createEvaluationCriteriaQuestion', (type = 'competency', details) => {
  cy.visit(`/questions/create/evaluation/?subtype=${type}`)

  cy.get('form[data-test-id="evaluation-question-form"]')
    .within(() => {
      cy.get('input[name="name"]').first().type(details.name || 'Are you good at maths?')
    })

  cy.get('[data-test-id="criteria-option-input-field"]').as('criteria')
    .within(() => {
      cy.get('button').should('contain', 'Create new').click({ force: true})
    })

  cy.document().its('body')
    .find(`#criteria-option-modal`)
    .within(() => {
      cy.get('input[name="name"]').type(details.criteria || 'Math')
      cy.get('button[type="submit"]').click()
    })
    .wait(2000)
    
  cy.get('button[type="submit"]').should('contain', 'Add question').click()

  cy.get('[data-test-id="alert-success"]').should('contain', 'Question created')
})
