describe('Language switcher', () => {
    beforeEach(() => {
        cy.login('joe.riley@example.com', 'test123')
    })

    it('url should reflect prefered language', () => {
        cy.visit('/se/projects/')

        cy.location('pathname').should('contain', '/en/projects/')

        cy.changeLanguage('SE')
            
        cy.location('pathname').should('contain', '/se/projects/')
        cy.title().should('contain', 'Projects (SE) listing')

        cy.visit('/en/projects/')

        cy.location('pathname').should('contain', '/se/projects/')

    })
})