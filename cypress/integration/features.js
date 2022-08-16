describe('Competency feature', () => {
  beforeEach(() => {
    cy.login('jane.philips@example.com', 'test123', 'features')
  })

  it('form should allow filtering and selecting competency questions', () => {
    cy.createCompetencyQuestion({ name: 'CQ1', criteria: { name: 'CA' } })
    cy.createCompetencyQuestion({ name: 'CQ2', criteria: { name: 'CB' } })
    cy.createCompetencyQuestion({ name: 'CQ3', criteria: { name: 'CC' } })

    cy.visit('/projects/create/')
    cy.title().should('contain', 'Create project')

    cy.get('form[data-test-id="project-form"]').within(() => {

      cy.get('[data-test-id="feature-competency-questions"]').drag('[data-test-id="stage-2"] .Droppable')

      cy.get('[data-test-id="stage-2"]')
        .contains('Competency based questions')

        cy.get('[data-test-id="feature-form"]')
          .should('contain', 'Competency')
          .within(() => {
            cy.contains('Selected questions')
              .parent()
              .should('contain', 'No questions.')

            cy.get('[data-test-id="question-explorer"]')
              .within(() => {
                cy.get('ul')
                  .last()
                  .within(() => {
                    cy.get('li').should('have.length', 3);

                    cy.get('li').eq(0)
                    .should('contain', 'CQ1')
                    .should('contain', 'CA')
    
                    cy.get('li').eq(1)
                      .should('contain', 'CQ2')
                      .should('contain', 'CB')
    
                    cy.get('li').eq(2)
                      .should('contain', 'CQ3')
                      .should('contain', 'CC')
                  })

                cy.get('input[type="text"]').type('Q2')
                
                cy.get('ul')
                  .last()
                  .within(() => {
                    cy.get('li').should('have.length', 1);

                    cy.get('li').eq(0)
                      .should('contain', 'CQ2')
                  })

                cy.get('input[type="text"]').type('{selectAll}{backspace}CC')
                
                cy.get('ul')
                  .last()
                  .within(() => {
                    cy.get('li').should('have.length', 1);

                    cy.get('li').eq(0)
                      .should('contain', 'CQ3')
                      .find('button').click()
                  })

                cy.contains('No questions')

                cy.get('input[type="text"]').type('{selectAll}{backspace}')

                cy.get('ul').last().children().should('have.length', 2)

                cy.contains('Your questions').click()

                cy.contains('No questions')
              })



          cy.on('window:confirm', (message) => {
            expect(message).to.equal('Are you sure?')

            return true;
          })

          cy.contains('Selected questions')
            .parent()
            .within(() => {
              cy.get('ul')
                .contains('CQ3')
                .closest('li')
                .find('button[data-test-id="trash-button"]')
                .click()
            })
            .should('contain', 'No questions');

          cy.contains('Your questions').click()

          cy.get('[data-test-id="question-explorer"] ul').last()
            .children().should('have.length', 3)
        })
    })
  })
})
