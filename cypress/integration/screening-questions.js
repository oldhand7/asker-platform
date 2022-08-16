describe('Screening questions', () => {
  beforeEach(() => {
      cy.login('joe.smith@example.com', 'test123', 'screening-questions')
  })

  it('creates 4 screening questions of 4 different types and assigns for project for interview', () => {
    //Question 1
    cy.createScreeningChoiceQuestion({
      name: 'Do you like fruits?',
      desc: 'Fruits fruits fruits'
    })

    //Question 2
    cy.createScreeningChoiceQuestion({
      name: 'What music do you like?',
      desc: 'Music music music',
      choices: ['Pop', 'Rock', 'Electronic', 'Classical', 'Other'],
      multichoice: true
    })

    //Question 3
    cy.createScreeningRangeQuestion({
      name: 'How deep is Atlantic Ocean?',
      desc: 'Ocean ocean ocean',
      min: 1,
      max: 100,
      step: 1,
      unit: 'km'
    })


    cy.createDummyProject('Position X')

    cy.contains('Position X')
          .closest('ul')
          .listFirstRowNavigate('Edit')

      cy.contains('Add stage').click()

      cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-2"] .Droppable')

      cy.get('[data-test-id="stage-2"]')
        .contains('Screening questions')

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('h3').should('contain', 'Screening')

          cy.get('[data-test-id="question-explorer"]')
            .within(() => {
              cy.get('ul')
                .last()
                .within(() => {
                  cy.get('li').eq(0)
                  .should('contain', 'Do you like fruits?')
                  .should('contain', 'Yes/No')
    
                  cy.get('li').eq(1)
                    .should('contain', 'How deep is Atlantic Ocean?')
                    .should('contain', 'Range')
    
                  cy.get('li').eq(2)
                    .should('contain', 'What music do you like?')
                    .should('contain', 'Multiple choice')
                })

                cy.get('button[data-test-id="question-explorer-option"]').eq(0)
                  .should('contain', 'Yes/No').click()

                cy.get('ul')
                  .last()
                  .should('contain', 'Do you like fruits?')
                  .children()
                  .should('have.length', 1)

               cy.get('button[data-test-id="question-explorer-option"]').eq(0)
                .should('contain', 'Yes/No').click()

               cy.get('button[data-test-id="question-explorer-option"]').eq(1)
                .should('contain', 'Multiple choice').click()

              cy.get('ul')
                .last()
                .should('contain', 'What music do you like?')
                .children()
                .should('have.length', 1)

              
              cy.get('button[data-test-id="question-explorer-option"]').eq(2)
                .should('contain', 'Range').click()
    
                  
              cy.get('ul')
                .last()
                .children()
                .should('have.length', 2)
                .first()
                .should('not.contain', 'Do you like fruits?')

                cy.get('button[data-test-id="question-explorer-option"]').eq(0)
                .should('contain', 'Yes/No').click()

                cy.get('ul')
                  .last()
                  .find('button')
                  .should('have.length', 3)
                  .click({ multiple: true })
            })

          cy.get('[data-test-id="question-manager"]')
              .should('contain', 'Do you like fruits?')
              .should('contain', 'What music do you like?')
              .should('contain', 'How deep is Atlantic Ocean?')
        })

        cy.contains('Save project').click()

        cy.get('[data-test-id="alert-success"]')
          .should('contain', 'Project saved')

        cy.contains('Position X').closest('li').click()

        cy.location('pathname').should('contain', '/overview/')

        cy.addProjectCandidate('Jimmy', 'jimmy.davis@yahoo.com')
          .wait(1000)

        cy.contains('Jimmy')
          .closest('[data-test-id="flex-table-row"]')
          .contains('Start interview')
          .click()

        cy.get('[data-test-id="feature-form"]').eq(1)
          .within(() => {
            //Q1
            cy.get('[data-test-id="screening-question-int"]').eq(0)
            .should('contain', 'Screening question')
            .should('contain', 'Do you like fruits?')
            .should('contain', 'Fruits fruits fruits')
            .find('[data-test-id="question-answers"]')
            .children()
            .should('have.length', 2)
            .parent()
            .within(() => {
              cy.get('li').eq(0)
                .should('contain', 'Yes')
                .find('input[type="radio"]')

              cy.get('li').eq(1)
                .should('contain', 'No')
                .find('input[type="radio"]')
                .click()
            })

            //Q2
            cy.get('[data-test-id="screening-question-int"]').eq(1)
            .should('contain', 'Screening question')
            .should('contain', 'How deep is Atlantic Ocean?')
            .should('contain', 'Ocean ocean ocean')
            .within(() => {
              cy.get('[role="slider"]').eq(0)
                .should('have.attr', 'aria-valuemin', '1')
                .should('have.attr', 'aria-valuenow', '1')
                .should('contain', '1 km')

              cy.get('[role="slider"]').eq(1)
                .should('have.attr', 'aria-valuemax', '100')
                .should('have.attr', 'aria-valuenow', '50')
                .should('contain', '50 km')
            })

            //Q3
            cy.get('[data-test-id="screening-question-int"]').eq(2)
            .should('contain', 'Screening question')
            .should('contain', 'What music do you like?')
            .should('contain', 'Music music music')
            .find('[data-test-id="question-answers"]')
            .children()
            .should('have.length', 5)
            .parent()
            .within(() => {
              cy.get('li').eq(0)
                .should('contain', 'Pop')
                .find('input[type="checkbox"]')
                .check()

              cy.get('li').eq(1)
                .should('contain', 'Rock')
                .find('input[type="checkbox"]')
                .check()

              cy.get('li').eq(2)
                .should('contain', 'Electronic')
                .find('input[type="checkbox"]')

              cy.get('li').eq(3)
                .should('contain', 'Classical')
                .find('input[type="checkbox"]')

              cy.get('li').eq(4)
                .should('contain', 'Other')
                .find('input[type="checkbox"]')
            })
          })

        cy.contains('Complete interview').click()

        cy.location('pathname').should('contain', '/overview/')

        cy.contains('Jimmy')
          .closest('[data-test-id="flex-table-row"]')
          .find('[data-test-id="edit-button"]')
          .last()
          .click()

        cy.get('[data-test-id="feature-form"]').eq(1)
          .within(() => {
            //Q1A
            cy.get('[data-test-id="screening-question-int"]').eq(0)
              .find('input[type="radio"][checked]').parent().should('contain', 'No')

            //Q2A
            cy.get('[data-test-id="screening-question-int"]').eq(2)
              .within(() => {
                cy.get('input[type="checkbox"][checked]')
                  .should('have.length', 2)

                cy.get('input[type="checkbox"][checked]')
                  .eq(0).parent()
                  .should('contain', 'Pop')

                cy.get('input[type="checkbox"][checked]')
                  .eq(1).parent()
                  .should('contain', 'Rock')
              })
          })
  })
})
