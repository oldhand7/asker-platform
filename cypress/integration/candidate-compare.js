describe('Candidate compare', () => {
    beforeEach(() => {
        cy.login('joe.gooney@example.com', 'test123')
    })

    it('should compare candidates', () => {
        cy.createCompetencyQuestion({ name: 'How well do you know CA?', criteria: { name: 'CA'}})
        cy.createScreeningChoiceQuestion({ name: 'Do you have drivers license?'})

        cy.createDummyProject('Project X')

        cy.contains('Project X').closest('li').listRowNavigate('Edit')

        cy.addStage('Competency')
            
        cy.get('[data-test-id="feature-form"]')
          .within(() => {
            cy.contains('How well do you know CA?').closest('li').find('button').click();
          })


        cy.addStage('Screening')

        cy.get('[data-test-id="feature-form"]')
          .within(() => {
            cy.contains('Do you have drivers license?').closest('li').find('button').click();
          })
            
        cy.saveProject()

        cy.contains('Project X').closest('li').click()
        
        cy.addProjectCandidate('John Best', 'john.best@example.com')

        cy.contains('John Best')
          .closest('[data-test-id="flex-table-row')
          .contains('Start interview')
          .click()

          cy.get('#language-choose-modal').trigger('keyup', { code: "Escape" })
        
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

          cy.get('#language-choose-modal').trigger('keyup', { code: "Escape" })
        
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
          .closest('[data-test-id="compare-box"]')
          .within(() => {
            cy.contains('John Best').closest('li')
              .should('contain', '100%')
              .find('input[type="checkbox"]')
              .should('be.checked')

            cy.contains('John Good').closest('li')
              .should('contain', '75%')
              .find('input[type="checkbox"]')
              .should('not.be.checked')

            cy.contains('Show comparsion')
              .click()
          })
    

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
          .closest('[data-test-id="candidate-compare-column"]')
          .within(() => {
            cy.get('[data-test-id="candidate-compare-column-evaluation"]')
              .first()
              .within(() => {
                cy.root().children().first()
                  .click()
                  .find('[data-test-id="evaluation-score-bar"]')
                  .should('contain', '100%')
    
                 cy.root().children().last()
                  .should('contain', 'CA')
                  .find('[data-test-id="criteria-rating"]')
                  .should('contain', '5')
              })

            cy.get('[data-test-id="candidate-compare-column-evaluation"]')
              .last()
              .within(() => {
                cy.root().children().first()
                  .should('contain', 'Do you have drivers license?')
                  .should('contain', 'Yes')
              })
          })


        cy.contains('John Good')
          .closest('div')
          .should('contain', '75%')
          .closest('[data-test-id="candidate-compare-column"]')
          .within(() => {
            cy.get('[data-test-id="candidate-compare-column-evaluation"]')
              .first()
              .within(() => {
                cy.root().children().first()
                  .find('[data-test-id="evaluation-score-bar"]')
                  .should('contain', '75%')
    
                  cy.root().children().last()
                  .should('contain', 'CA')
                  .find('[data-test-id="criteria-rating"]')
                  .should('contain', '4')
              })

            cy.get('[data-test-id="candidate-compare-column-evaluation"]')
              .last()
              .within(() => {
                cy.root().children().first()
                  .should('contain', 'Do you have drivers license?')
                  .should('contain', 'No')
              })
          })

        cy.get('[data-test-id="trash-button"]').first().click()
        
        cy.get('[data-test-id="project-interview-compare"]')
          .should('not.contain', 'John Best')
    })
})