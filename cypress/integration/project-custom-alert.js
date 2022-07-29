describe('Project custom alert', () => {
    beforeEach(() => {
        cy.login('joe.lubeck@example.com', 'test123')
    })

    it('should show custom alert for interviewer', () => {
        cy.createCompetencyQuestion({
            name: 'Are you familiar with ISO-123?',
            note: 'This is important.',
            criteria: {
                name: 'ISO-123',
                create: true
            }
        })

        cy.createDummyProject('Project ISO-123')

        cy.contains('Project ISO-123').closest('li').listNavigate('Edit')

        cy.contains('Add stage').click()
      
        cy.get('[data-test-id="feature-competency-questions"]').drag('[data-test-id="stage-2"] .Droppable')
         .wait(1000)

            
         cy.get('[data-test-id="feature-form"] [data-test-id="question-explorer"]')
         .within(() => {
           cy.contains('Are you familiar with ISO-123?')
             .closest('li')
             .find('button[data-test-id="add-question"]').first().click()  
         })

         cy.get('[data-test-id="feature-form"] [data-test-id="question-manager"]')
            .within(() => {
                cy.contains('Are you familiar with ISO-123?')
                    .closest('li')
                    .find('button[data-test-id="note-button"]').first().click()      
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

        cy.get('[data-test-id="feature-form"]').eq(1)
            .should('contain', 'ISO-123')
            .should('contain', 'Are you familiar with ISO-123?')
            .should('contain', 'This is importante!')
    })
})