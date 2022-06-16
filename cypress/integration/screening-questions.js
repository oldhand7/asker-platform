describe('Screening questions', () => {
  beforeEach(() => {
      cy.login('joe.smith@example.com', 'test123', 'screening-questions')
  })

  it('creates 4 screening questions of 4 different types and assigns for project for interview', () => {
    //Question 1
    cy.visit('/questions/create/screening')

    cy.contains('Yes/No').click()

    cy.get('[data-test-id="title"]')
      .should('contain', 'Create a screening question')
      .should('contain', 'Yes/No')

    cy.get('[data-test-id="choice-question-form"]')
      .within(() => {
        cy.get('input[name="name"]').type('Do you like fruits?')
        cy.get('[data-test-id="html-input-field"]').click()
          .type('Fruits fruits fruits')

        cy.get('[data-test-id="answers-form"]')
          .find('ul')
          .within(() => {
            cy.get('li').eq(0).find('input[name="answers[]"]').type('Yes{enter}')
            cy.get('li').eq(1).find('input[name="answers[]"]').type('No')
          })
          .children()
          .should('have.length', 2)
      })

      cy.contains("Create question").click()

      cy.get('table').first()
        .find('tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(0).should('contain', 'Screening').should('contain', 'Yes/No')
          cy.get('td').eq(2).contains('Do you like fruits?')
        })


      //Question 2
      cy.visit('/questions/create/screening')

      cy.contains('Multiple choice').click()

      cy.get('[data-test-id="title"]')
        .should('contain', 'Create a screening question')
        .should('contain', 'Multiple choice')

      cy.get('[data-test-id="choice-question-form"]')
        .within(() => {
          cy.get('input[name="name"]').type('What music do you like?')
          cy.get('[data-test-id="html-input-field"]').click()
            .type('Music music music')

          cy.get('[data-test-id="answers-form"]')
            .find('ul')
            .within(() => {
              cy.get('li').eq(0).find('input[name="answers[]"]').type('Pop{enter}')
              cy.get('li').eq(1).find('input[name="answers[]"]').type('Rock{enter}')
              cy.get('li').eq(2).find('input[name="answers[]"]').type('Electronic{enter}')
              cy.get('li').eq(3).find('input[name="answers[]"]').type('Classical{enter}')
              cy.get('li').eq(4).find('input[name="answers[]"]').type('Other')
            })
            .children()
            .should('have.length', 5)
        })

        cy.contains("Create question").click()

        cy.get('table').first()
          .find('tbody tr')
          .first()
          .within(() => {
            cy.get('td').eq(0).should('contain', 'Screening').should('contain', 'Multiple choice')
            cy.get('td').eq(2).contains('What music do you like?')
          })

        //Question 3
        cy.visit('/questions/create/screening')

        cy.contains('Range').click()

        cy.get('[data-test-id="title"]')
          .should('contain', 'Create a screening question')
          .should('contain', 'Range')

        cy.get('[data-test-id="range-question-form"]')
          .within(() => {
            cy.get('input[name="name"]').type('How deep is Atlantic Ocean?')
            cy.get('[data-test-id="html-input-field"]').click()
              .type('Ocean ocean ocean')

            cy.get('input[name="unit"]').type('km')
            cy.get('input[name="min"]').type('1')
            cy.get('input[name="max"]').type('100')
          })

          cy.contains("Create question").click()

          cy.get('table').first()
            .find('tbody tr')
            .first()
            .within(() => {
              cy.get('td').eq(0).should('contain', 'Screening').should('contain', 'Range')
              cy.get('td').eq(2).contains('How deep is Atlantic Ocean?')
            })

        //Question 4
        cy.visit('/questions/create/screening')

        cy.contains('Text').click()

        cy.get('[data-test-id="title"]')
          .should('contain', 'Create a screening question')
          .should('contain', 'Text')

        cy.get('[data-test-id="text-question-form"]')
          .within(() => {
            cy.get('input[name="name"]').type('What is the meaning of life?')
            cy.get('[data-test-id="html-input-field"]').click()
              .type('Meaning meaning meaning')
          })

          cy.contains("Create question").click()

          cy.get('table').first()
            .find('tbody tr')
            .first()
            .within(() => {
              cy.get('td').eq(0).should('contain', 'Screening').should('contain', 'Text')
              cy.get('td').eq(2).contains('What is the meaning of life?')
            })

      cy.createDummyProject('Position X')
      cy.tableFirstRowNavigate('Edit')

      cy.contains('Add stage').click()

      cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-2"] .Droppable')

      cy.get('[data-test-id="stage-2"]')
        .contains('Screening questions')

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('h3').should('contain', 'Search screening question')

          cy.get('table').first()
            .find('tbody tr')
            .should('have.length', 4)
            .parent()
            .within(() => {
              //Sorted by ABC
              cy.get('tr').eq(0)
                .should('contain', 'Do you like fruits?')
                .should('contain', 'Yes/No')

              cy.get('tr').eq(1)
                .should('contain', 'How deep is Atlantic Ocean?')
                .should('contain', 'Range')

              cy.get('tr').eq(2)
                .should('contain', 'What is the meaning of life?')
                .should('contain', 'Text')

              cy.get('tr').eq(3)
                .should('contain', 'What music do you like?')
                .should('contain', 'Multiple choice')
            })

          cy.get('[data-test-id="subtype-filter"] button').eq(0)
            .should('contain', 'Yes/No').click()

          cy.get('table').first()
            .find('tbody tr')
            .should('have.length', 1)
            .first()
            .should('contain', 'Do you like fruits?')

          cy.get('[data-test-id="subtype-filter"] button').eq(0)
            .should('contain', 'Yes/No').click()

          cy.get('[data-test-id="subtype-filter"] button').eq(1)
            .should('contain', 'Multiple choice').click()

          cy.get('table').first()
            .find('tbody tr')
            .should('have.length', 1)
            .first()
            .should('contain', 'What music do you like?')

          cy.get('[data-test-id="subtype-filter"] button').eq(2)
            .should('contain', 'Range').click()

          cy.get('[data-test-id="subtype-filter"] button').eq(3)
            .should('contain', 'Text').click()

          cy.get('table').first()
            .find('tbody tr')
            .should('have.length', 3)
            .first()
            .should('not.contain', 'Do you like fruits?')

          cy.get('[data-test-id="subtype-filter"] button').eq(0)
            .should('contain', 'Yes/No').click()

          cy.get('table').first()
            .find('tbody tr')
            .should('have.length', 4)

          cy.get('table').first()
            .find('tbody')
            .within(() => {
              cy.get('tr').first().find('button').click()
              cy.get('tr').first().find('button').click()
              cy.get('tr').first().find('button').click()
              cy.get('tr').first().find('button').click()
            })

          cy.get('table').last()
            .should('contain', 'Do you like fruits?')
            .should('contain', 'What music do you like?')
            .should('contain', 'What is the meaning of life?')
            .should('contain', 'How deep is Atlantic Ocean?')
        })

        cy.contains('Save project').click()

        cy.get('[data-test-id="alert-success"]')
          .should('contain', 'Project saved')

        cy.tableFirstRowNavigate('Interviews')

        cy.addProjectCandidate('Jimmy', 'jimmy.davis@yahoo.com')
          .wait(2000)

        cy.tableFirstRowNavigate('Start interview')

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
                .should('have.value', 'Yes')

              cy.get('li').eq(1)
                .should('contain', 'No')
                .find('input[type="radio"]')
                .should('have.value', 'No')
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
              .should('contain', 'What is the meaning of life?')
              .should('contain', 'Meaning meaning meaning')
              .get('[data-test-id="html-input-field"]').click().type('42')

            //Q4
            cy.get('[data-test-id="screening-question-int"]').eq(3)
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

        cy.tableFirstRowNavigate('Edit response')

        cy.get('[data-test-id="feature-form"]').eq(1)
          .within(() => {
            //Q1A
            cy.get('[data-test-id="screening-question-int"]').eq(0)
              .find('input[type="radio"][checked]').should('have.value', 'No')

            //Q4A
            cy.get('[data-test-id="screening-question-int"]').eq(2)
              .find('[data-test-id="html-input-field"]').should('contain', '42')

            //Q2A
            cy.get('[data-test-id="screening-question-int"]').eq(3)
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
