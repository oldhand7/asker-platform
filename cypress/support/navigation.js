Cypress.Commands.add('tableFirstRowNavigate', (code = 'Edit') => {
  cy.get('table tbody tr')
    .first()
    .find('td').last()
    .find('button').click().parent()
    .contains(code).click()
})

Cypress.Commands.add('tableLastRowNavigate', (code = 'Edit') => {
  cy.get('table tbody tr')
    .last()
    .find('td').last()
    .find('button').click().parent()
    .contains(code).click()
})