Cypress.Commands.add(
    'findHtmlInputAndType',
    {  prevSubject: true },
    (subject, text = '') => {
        cy.wrap(subject)
        .within(() => {
            cy.get('[contenteditable="true"]')
                .click()
                .wait(500)
                .type(text)
        })
})