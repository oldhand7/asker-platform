Cypress.Commands.add('createDummyTemplate', (name = 'Demo ABC') => {
  cy.visit('/templates/create/')

  cy.get('form[data-test-id="template-form"]').within(() => {
    cy.get('input[name="templateName"]').type(name)
    cy.get('button').contains('Create template').click()
  })

  cy.get('[data-test-id="alert-success"]').should('contain', 'Template created')
})
