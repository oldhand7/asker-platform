describe('Question explorer', () => {
    beforeEach(() => {
        cy.login('joe.goofey@example.com', 'test123')
    })

    it('should allow control of question list using popup', () => {
        cy.createExperienceQuestion({ name: 'QE1', criteria: { name: 'E1' } })
        cy.createExperienceQuestion({ name: 'QE2', criteria: { name: 'E2' } })
        cy.createExperienceQuestion({ name: 'QE3', criteria: { name: 'E3' } })
        cy.createExperienceQuestion({ name: 'QE4', criteria: { name: 'E4' } })
        cy.createExperienceQuestion({ name: 'QE5', criteria: { name: 'E5' } })

        cy.createDummyTemplate('Demo template')

        cy.visit('/templates')

        cy.contains('Demo template').closest('li').listRowNavigate('Edit')

        cy.addStage('Experience')

        cy.get('[data-test-id="feature-form"] [data-test-id="question-explorer"]')
            .within(() => {
                cy.get('ul').last().children().should('have.length', 5)

                cy.contains('E1').first().click()

                cy.get('ul').last().children().should('have.length', 1)

                cy.contains('Your questions').click()

                cy.contains('No questions')

                cy.contains('Your questions').click()

                cy.get('ul').last().children().should('have.length', 1)

                cy.get('button[data-test-id="subtype-control"]').click()
                
                cy.get('[data-test-id="subtype-popup"]')
                  .within(() => {
                    cy.get('input[type="checkbox"]').eq(0)
                        .should('not.be.checked')
                        .parent()
                        .should('contain', 'Select all')

                    cy.get('input[type="checkbox"]').eq(1)
                        .should('be.checked')
                        .parent()
                        .should('contain', 'E1')

                    cy.get('input[type="checkbox"]').eq(2)
                        .should('not.be.checked')
                        .parent()
                        .should('contain', 'E2')
                        .click()

                    cy.get('input[type="checkbox"]').eq(3)
                        .should('not.be.checked')
                        .parent()
                        .should('contain', 'E3')
                        .click()

                    cy.get('input[type="checkbox"]').eq(4)
                        .should('not.be.checked')
                        .parent()
                        .should('contain', 'E4')
                        .click()

                    cy.get('input[type="checkbox"]').eq(5)
                        .should('not.be.checked')
                        .parent()
                        .should('contain', 'E5')
                        .click()

                    cy.get('input[type="checkbox"]').eq(0)
                        .should('be.checked')
                        .click()

                    cy.get('input[type="checkbox"]').eq(3)
                        .should('not.be.checked')
                        .parent()
                        .should('contain', 'E3')
                        .click()
                  })
                  .trigger('keyup', { code: "Escape" })

                  cy.get('ul').last().find('li').should('have.length', 1).first().should('contain', 'QE3')
            })
    })
})