describe('Language switcher', () => {
    beforeEach(() => {
        cy.login('joe.riley@example.com', 'test123')
    })

    it('url should reflect prefered language', () => {
        cy.visit('/se/projects/')

        cy.location('pathname').should('contain', '/en/projects/')

        cy.get('[data-test-id="language-switcher"]').click()
            .within(() => {
                cy.contains('SE', { matchCase: false }).click()
            })
            
        cy.contains('Projects_SE')

        cy.location('pathname').should('contain', '/se/projects/')

        cy.visit('/en/projects/')

        cy.location('pathname').should('contain', '/se/projects/')

    })
})