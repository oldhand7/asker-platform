require('@4tw/cypress-drag-drop')

Cypress.Commands.add('login', (username, password, delay = 1000) => {
  cy.session([username, password], () => {
    cy.visit('/login/')

    cy.get('form[data-test-id="login-form"]').within(() => {
      cy.get('input[type="text"][name="email"]').type(username)
      cy.get('input[type="password"][name="password"]').type(password)
    }).submit()

    cy.location('pathname').should('eq', '/projects/')
  })
})

Cypress.Commands.add('simpleLogin', (username, password, delay = 1000) => {
  cy.visit('/login/')

  cy.get('form[data-test-id="login-form"]').within(() => {
    cy.get('input[type="text"][name="email"]').type(username)
    cy.get('input[type="password"][name="password"]').type(password)
  }).submit().wait(delay)
})
