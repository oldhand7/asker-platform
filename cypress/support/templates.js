Cypress.Commands.add('createDummyTemplate', (name = 'Demo ABC') => {
  cy.visit('/templates/create/')

  cy.get('form[data-test-id="project-form"]').within(() => {
    cy.get('input[name="name"]').type(name)

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]')
          .click()
          .wait(500)
          .type('Lorem ipsum dolor sit amet')
    
      })

    cy.get('button').contains('Create template').click()
  })

  cy.get('[data-test-id="alert-success"]').should('contain', 'Template created')
})