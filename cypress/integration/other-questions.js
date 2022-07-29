describe('Other questions', () => {
  beforeEach(() => {
      cy.login('joe.smith@example.com', 'test123', 'other-questions')
  })

  it('creates 4 screening questions of 4 different types and assigns for project for interview', () => {

    cy.visit('/questions/create/other')

    cy.contains('Text').click()

    cy.get('[data-test-id="title"]')
      .should('contain', 'Create other question')
      .should('contain', 'Text')

    cy.get('[data-test-id="text-question-form"]')
      .within(() => {
        cy.get('input[name="name.en"]').type('What is the meaning of life?')
        cy.get('[data-test-id="html-input-field"]').click()
          .type('Meaning meaning meaning')
      })

      cy.contains("Create question").click()

      cy.get('table').first()
        .find('tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(0).should('contain', 'Other').should('contain', 'Text')
          cy.get('td').eq(2).contains('What is the meaning of life?')
        })

      cy.createDummyProject('Position Y')

      cy.contains('Position Y')
        .closest('ul')
        .listFirstRowNavigate('Edit')

      cy.contains('Add stage').click()

      cy.get('[data-test-id="feature-other-questions"]').drag('[data-test-id="stage-2"] .Droppable')

      cy.get('[data-test-id="stage-2"]')
        .contains('Other')

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('h3').should('contain', 'Other')

          cy.get('[data-test-id="question-explorer"]')
            .within(() => {
              cy.contains('What is the meaning of life?').closest('li')
                .find('button').click()
            })


          cy.get('[data-test-id="question-manager"]')
            .should('contain', 'What is the meaning of life?')
        })

        cy.contains('Save project').click()

        cy.get('[data-test-id="alert-success"]')
          .should('contain', 'Project saved')


        cy.contains('Position Y')
          .closest('li')
          .click()

        cy.addProjectCandidate('Jimmy', 'jimmy.davis@yahoo.com')
          .wait(1000)

        cy.contains('Jimmy')
          .closest('[data-test-id="flex-table-row"]')
          .contains('Start interview')
          .click()

        cy.get('[data-test-id="feature-form"]').eq(1)
          .within(() => {

            //Q3
            cy.get('[data-test-id="other-question-int"]').eq(0)
              .should('contain', 'Other question')
              .should('contain', 'What is the meaning of life?')
              .should('contain', 'Meaning meaning meaning')
              .get('[data-test-id="html-input-field"]').click().type('42')
          })

        cy.contains('Complete interview').click()

        cy.location('pathname').should('contain', '/overview/')

        cy.contains('Jimmy')
          .closest('[data-test-id="flex-table-row"]')
          .find('[data-test-id="edit-button"]')
          .click()

        cy.get('[data-test-id="feature-form"]').eq(1)
          .within(() => {
            cy.get('[data-test-id="other-question-int"]').eq(0)
              .find('[data-test-id="html-input-field"]').should('contain', '42')
          })
  })
})
