describe('Project custom note', () => {
    beforeEach(() => {
        cy.login('joe.lubeck@example.com', 'test123')
    })

    it('should show custom note for interviewer', () => {
        cy.createCompetencyQuestion({
            name: 'Are you familiar with ISO-123?',
            note: 'This is important.',
            criteria: {
                name: 'ISO-123',
                create: true
            }
        })

        cy.createDummyProject('Project ISO-123')

        cy.contains('Project ISO-123').closest('li').listRowNavigate('Edit')

        cy.addStage('Competency')
            
        cy.get('[data-test-id="feature-form"]')
            .within(() => {
                cy.contains('Are you familiar with ISO-123?').closest('li').find('button').click()
                cy.get('button[data-test-id="note-button"]').click()
            })

         cy.get('#question-note-modal')
            .within(() => {
                cy.get('[data-test-id="html-input-field"]').type('This is importante!')
                cy.get('button[type="submit"]').click()
            })

         cy.contains('Save project').click()

         cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')
      
         cy.contains('Project ISO-123').closest('li').click()
    
         cy.addProjectCandidate('Tom', 'tom@foobar.net')
    
         cy.contains('Start interview').click()

         cy.get('#language-choose-modal').trigger('keyup', { code: "Escape" })

        cy.get('[data-test-id="feature-form"]').eq(1)
            .should('contain', 'ISO-123')
            .should('contain', 'Are you familiar with ISO-123?')
            .within(() => {
               cy.contains('This is importante!').closest('[data-test-id="dismiss-alert"]').contains('OK').click()
               cy.root().should('not.contain', 'This is importante!')
               cy.contains('Good')
            })

        cy.contains('Complete interview').click()

        cy.location('pathname').should('contain', '/overview/')

        cy.contains('Tom').closest('[data-test-id="flex-table-row"]').find('button[data-test-id="edit-button"]').last().click()

        cy.get('[data-test-id="feature-form"]').eq(1)
            .within(() => {
            cy.root().should('not.contain', 'This is importante!')
            })
    })
})