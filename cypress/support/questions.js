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
