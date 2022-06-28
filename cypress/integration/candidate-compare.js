describe('Candidate compare', () => {
    beforeEach(() => {
        cy.login('joe.gooney@example.com', 'test123')
    })

    it('should compare candidates', () => {
        cy.createCompetencyQuestion({ name: 'How well do you know CA?', criteria: { name: 'CA'}})
        cy.createScreeningChoiceQuestion({ name: 'Do you have drivers license?'})

        cy.createDummyProject('Project X')

        cy.tableFirstRowNavigate('Edit')

        cy.contains('Add stage')
          .click()
          .click()
            
        cy.get('[data-test-id="stage-2"] [data-test-id="load-button"]').click()
        cy.get('#feature-select-modal').contains('Competency').click()
        cy.get('[data-test-id="feature-form"]')
            .find('table').first()
            .within(() => {
                cy.contains('CA').closest('tr').find('[data-test-id="add-question"]').click()
            })

        cy.get('[data-test-id="stage-3"] [data-test-id="load-button"]').click()
        cy.get('#feature-select-modal').contains('Screening').click()
        cy.get('[data-test-id="feature-form"]')
            .find('table').first()
            .find('button[data-test-id="add-question"]').first()
            .click()
            
        cy.contains('Save project')
          .click()

        cy.get('[data-test-id="alert-success"]').contains('Project saved')

        cy.get('table tbody tr').first().click()
        
        cy.addProjectCandidate('John Best', 'john.best@example.com')

        cy.contains('John Best')
          .closest('[data-test-id="flex-table-row')
          .contains('Start interview')
          .click()
        
        cy.get('[data-test-id="feature-form"]').eq(1)
            .should('contain', 'Competency')
            .should('contain', 'CA')
            .should('contain', 'How well do you know CA?')
            .contains('Excellent').click()

        cy.get('[data-test-id="feature-form"]').eq(2)
            .should('contain', 'Screening')
            .should('contain', 'Do you have drivers license?')
            .contains('Yes')
            .click()

        cy.contains('Complete interview').click()

        cy.location('pathname').should('contain', '/overview/')

        cy.addProjectCandidate('John Good', 'john.good@example.com')

        cy.contains('John Good')
          .closest('[data-test-id="flex-table-row')
          .contains('Start interview')
          .click()
        
        cy.get('[data-test-id="feature-form"]').eq(1)
            .should('contain', 'Competency')
            .should('contain', 'CA')
            .should('contain', 'How well do you know CA?')
            .contains('Great').click()

        cy.get('[data-test-id="feature-form"]').eq(2)
            .should('contain', 'Screening')
            .should('contain', 'Do you have drivers license?')
            .contains('No')
            .click()

        cy.contains('Complete interview').click()

        cy.location('pathname').should('contain', '/overview/')
        
        cy.contains('John Best')
            .closest('[data-test-id="flex-table-row')
            .find('[data-test-id="compare-button"]')
            .click()

        cy.contains('Compare')
          .should('contain.text', 'Compare (1/2)')
          .click()
          .closest('[data-test-id="compare-box"]')
          .contains('Show comparsion')
          .click()

        cy.location('pathname').should('contain', '/compare/')
        
        cy.contains('Add candidate')
          .click()

        cy.get('#candidate-choose-modal')
            .within(() => {
                cy.contains('John Good').click()
                cy.contains('Choose candidates').click()
            })
            .wait(1000)

        cy.contains('John Best')
          .closest('div')
          .should('contain', '100%')

        cy.contains('John Good')
          .closest('div')
          .should('contain', '75%')

        cy.contains('Competencies')
          .closest('[data-test-id="interview-details-row"]')
          .within(() => {
            cy.get('[data-test-id="evaluation-score-bar"]')
              .eq(0)
              .should('contain', '100%')
            
            cy.get('[data-test-id="evaluation-score-bar"]')
              .eq(1)
              .should('contain', '75%')
              
            cy.get('ul')
              .eq(0)          
              .contains('CA')
              .closest('li') 
              .get('[data-test-id="criteria-rating"]')
              .should('contain', '5')

            cy.get('ul')
              .eq(1)          
              .contains('CA')
              .closest('li') 
              .get('[data-test-id="criteria-rating"]')
              .should('contain', '4')
          })

        cy.contains('Screening')
          .closest('[data-test-id="interview-details-row"]')
          .within(() => {
            cy.get('ul')
              .eq(0)
              .should('contain', 'Do you have drivers license?')
              .should('contain', 'Yes')

            cy.get('ul')
              .eq(1)
              .should('contain', 'Do you have drivers license?')
              .should('contain', 'No')
          })
 
        cy.get('[data-test-id="trash-button"]').first().click()
        
        cy.get('[data-test-id="project-interview-compare"]')
          .should('not.contain', 'John Best')
    })
})