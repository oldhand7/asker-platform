Cypress.Commands.add('createDummyProject', (name = 'Demo ABC', template = '') => {
  if (template) {
    cy.visit('/templates/')
    cy.get('input[name="q"]').type(template)

    cy.contains(template)
      .closest('li')
      .listNavigate('Create project')
  } else {
    cy.visit('/projects/create/')
  }

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

  cy.get('[data-test-id="alert-success"]').should('contain', 'Project created')
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
