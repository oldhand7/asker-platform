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

Cypress.Commands.add(
  'listFirstRowNavigate',
  {  prevSubject: true },
  (subject, code = 'Edit') => {
    cy.wrap(subject)
      .within(() => {
        cy.get('li')
        .first()
        .find('[data-test-id="compact-menu"]').click().parent()
        .contains(code).click()
      })

})

Cypress.Commands.add(
  'listRowNavigate',
  {  prevSubject: true },
  (subject, code = 'Edit') => {
    cy.wrap(subject)
      .find('[data-test-id="compact-menu"]').click().parent()
      .contains(code).click()
})