Cypress.Commands.add('createDummyProject', (name = 'Demo ABC') => {
  cy.visit('/projects/create/')

  cy.get('form[data-test-id="project-form"]').within(() => {
    cy.get('input[name="name"]').type(name)
    cy.get('[data-test-id="interviewers"]')
      .find('input').click()
      .closest('[data-test-id="interviewers"]')
      .find('[data-test-id="autocomplete-option"]')
      .first()
      .click()

    cy.get('button').contains('Create project').click()
  })
})

Cypress.Commands.add('addProjectCandidate', (name, email) => {
  cy.contains('Add candidate')
    .click()

  cy.get('[data-test-id="candidate-form"]').within(() => {
    cy.get('input[name="name"]').type(name)
    cy.get('input[name="email"]').type(email)
    cy.get('button[type="submit"]').click()
  })
})
