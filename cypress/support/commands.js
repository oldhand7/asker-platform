require('@4tw/cypress-drag-drop')
require('cypress-file-upload')
require('./projects')
require('./navigation')
require('./templates')
require('./questions')
require('./interview')

Cypress.Commands.add('login', (username, password, key = '') => {
  cy.session([username, password, key], () => {
    cy.visit('/login/')

    cy.get('form[data-test-id="login-form"]').within(() => {
      cy.get('input[type="text"][name="email"]')
        .type(`{selectAll}{backspace}${username}`)
      cy.get('input[type="password"][name="password"]')
        .type(`{selectAll}{backspace}${password}`)
    }).submit()

    cy.location('pathname').should('contain', '/projects/')
  })
})

Cypress.Commands.add('simpleLogin', (username, password, confirm = false) => {
  cy.visit('/login/')

  cy.get('form[data-test-id="login-form"]').within(() => {
    cy.get('input[type="text"][name="email"]')
      .type(`{selectAll}{backspace}${username}`)
    cy.get('input[type="password"][name="password"]')
      .type(`{selectAll}{backspace}${password}`)
  }).submit()

  if (confirm) {
    cy.location('pathname').should('contain', '/projects/')
  }
})

Cypress.Commands.add('logout', () => {
  cy.visit('/logout/')
  cy.location('pathname').should('contain', '/login/')
})

Cypress.Commands.add('confirmLoggedInAs', (name) => {
  cy.get('[data-test-id="user-card"]').contains(name)
})

Cypress.Commands.add('changeLanguage', (lang = 'EN') => {
  cy.get('[data-test-id="language-switcher"]').click()
    .within(() => {
        cy.contains(lang, { matchCase: false }).click()
    })
})