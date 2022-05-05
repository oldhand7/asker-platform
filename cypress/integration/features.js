describe('Competency feature', () => {
  beforeEach(() => {
    cy.login('jane.philips@example.com', 'test123', 'features')
  })

  it('form should allow filtering and selecting competency questions', () => {
    cy.visit('/projects/create/')
    cy.title().should('contain', 'Create project')

    cy.get('form[data-test-id="project-form"]').within(() => {

      cy.get('[data-test-id="feature-competency-questions"]').drag('[data-test-id="stage-2"] .Droppable')

      cy.get('[data-test-id="stage-2"]')
        .contains('Competency based questions')

        cy.get('[data-test-id="feature-form"]')
          .should('contain', 'Search Competency or question')
          .within(() => {

          cy.contains('Selected questions')
            .parent()
            .should('contain', 'No questions yet.')

          cy.get('table thead tr')
            .children()
            .should('have.length', 3)
            .parent()
            .within(() => {
              cy.get('th').eq(0).should('contain', 'Questions')
              cy.get('th').eq(1).should('contain', 'Competency')
            })


          cy.get('table tbody tr')
            .should('have.length', 3)
            .parent()
            .within(() => {
              cy.get('tr').eq(0)
                .should('contain', 'CQ1')
                .should('contain', 'CA')

              cy.get('tr').eq(1)
                .should('contain', 'CQ2')
                .should('contain', 'CB')

              cy.get('tr').eq(2)
                .should('contain', 'CQ3')
                .should('contain', 'CC')
            })

          cy.get('input[type="text"]').type('Q2')

          cy.get('table tbody tr')
            .should('have.length', 1)
            .first()
            .contains('CQ2')

          cy.get('input[type="text"]').type('{selectAll}{backspace}CC')

          cy.get('table tbody tr')
            .should('have.length', 1)
            .first()
            .contains('CQ3')
            .closest('tr')
            .find('button').click()

          cy.get('table tbody').should('contain', 'No questions found.')

          cy.get('input[type="text"]').type('{selectAll}{backspace}')

          cy.get('table tbody tr')
            .should('have.length', 2)

          cy.contains('Your questions').click()

          cy.get('table tbody').should('contain', 'No questions found.')

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
                .find('button')
                .click()
            })
            .should('contain', 'No questions yet.');

          cy.contains('Your questions').click()

          cy.get('table tbody tr')
            .should('have.length', 3)
        })
    })
  })
})
