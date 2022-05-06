describe('Questions', () => {
  beforeEach(() => {
    cy.login('joe.doe@example.com', 'test123', 'questions')
  })

  it('listing page should have questions table and filtering', () => {
    cy.visit('/questions/')
    cy.title().should('include', 'Questions listing')

    cy.get('[data-test-id="company-filter"]')
      .within(() => {
        cy.get('button').eq(0)
          .should('contain', 'Asker questions')
          .should('have.attr', 'data-state', 'on')
          .click()
          .should('have.attr', 'data-state', 'off')

        cy.get('button').eq(1)
          .should('contain', 'Your questions')
          .should('have.attr', 'data-state', 'on')
          .click()
          .should('have.attr', 'data-state', 'off')
          .click()
      })

    cy.get('[data-test-id="question-filter"]')
      .children()
      .should('have.length', 7)
      .parent()
      .within(() => {
        cy.get('li').eq(0).should('contain', 'Competency')
        cy.get('li').eq(1).should('contain', 'Experience')
        cy.get('li').eq(2).should('contain', 'Motivation')
        cy.get('li').eq(3).should('contain', 'Culture-fit')
        cy.get('li').eq(4).should('contain', 'Hard skill')
        cy.get('li').eq(5).should('contain', 'Screening')
        cy.get('li').eq(6).should('contain', 'Other')
      })

    cy.get('table thead tr')
      .first()
      .within(() => {
        cy.get('th').eq(0).should('contain', 'Question type')
        cy.get('th').eq(1).should('contain', 'Criterion')
        cy.get('th').eq(2).should('contain', 'Question')
        cy.get('th').eq(3).should('contain', 'Follow-up questions')
      })

    cy.contains('No questions to show.')

    cy.get('[data-test-id="dropdown-button"]')
      .find('ul').should('not.exist')

    cy.get('[data-test-id="dropdown-button"]')
      .contains('Create new question').click()
      .parent()
      .find('ul')
      .within(() => {
        cy.get('li').eq(0).should('contain', 'Competency based')
        cy.get('li').eq(1).should('contain', 'Experience based')
        cy.get('li').eq(2).should('contain', 'Motivation based')
        cy.get('li').eq(3).should('contain', 'Culture-fit based')
        cy.get('li').eq(4).should('contain', 'Hard skill based')
        cy.get('li').eq(5).should('contain', 'Screening')
        cy.get('li').eq(6).should('contain', 'Other')
      })
  })

  it('adding competency question', () => {
    cy.visit('/questions/')

    cy.get('[data-test-id="dropdown-button"]')
      .contains('Create new question').click()
      .parent()
      .find('ul')
      .children()
      .contains('Competency based')
      .click()

    cy.title().should('include', 'Create a new competency based question')

    cy.get('form[data-test-id="evaluation-question-form"]')
      .should('contain', 'Create a new competency based question')
      .within(() => {
        cy.get('input[name="name"]').first().type('Sample question')
        cy.get('textarea[name="desc"]').type('Sample question desc')

        cy.get('[data-test-id="criteria-option-input-field"]').as('criteria')
          .within(() => {
            cy.contains('Competency')
            cy.get('input[name="q"]').type("Criteria A")
            cy.get('ul').should('contain', 'No results.')
            cy.get('button').should('contain', 'Create new').click({ force: true})
          })

        cy.document().its('body')
          .find('#criteria-option-modal')
          .should('contain', 'Competency option')
          .within(() => {
            cy.get('input[name="name"]').type('Criteria A')
            cy.get('button[type="submit"]').click()
        })

        cy.get('@criteria')
          .should('contain', 'Criteria A')
          .find('button[data-test-id="trash-button"]')
          .click()

        cy.get('@criteria')
          .should('not.contain', 'Criteria A')
          .within(() => {
            cy.get('input[name="q"]').click()
            cy.contains('Criteria A').click()
          })
          .should('contain', 'Criteria A')

        cy.get('[data-test-id="followup-question-field"]').within(() => {
            cy.get('input')
              .type('Followup question 1{enter}')
              .type('Followup question 2{enter}')
              .type('Followup question 3{enter}')

            cy.get('ul')
              .children()
              .should('have.length', 3)
              .parent()
              .within(() => {
                cy.get('li').eq(0).should('contain', 'Followup question 1')
                cy.get('li').eq(1).should('contain', 'Followup question 2')
                cy.get('li').eq(2).should('contain', 'Followup question 3')
              })
        })

        cy.get('[data-test-id="question-score-input-field"] > ul')
          .within(() => {
            cy.contains('Unsatisfactory')
              .closest('li')
              .within(() => {
                cy.get('input').should('not.exist')
                cy.get('button').click()
                cy.get('input').should('exist').type('{selectAll}{backspace}Very bad{enter}')
                cy.get('input').should('not.exist')
                cy.root().should('contain', 'Very bad')
              })
              .parent()
              .children().should('have.length', 4)

            cy.contains('Fair')
              .closest('ul')
              .children()
              .should('have.length', 1)

            cy.contains('Good')
              .closest('ul')
              .children()
              .should('have.length', 4)

            cy.contains('Great')
              .closest('ul')
              .children()
              .should('have.length', 1)

            cy.contains('Excellent')
              .closest('ul')
              .children()
              .should('have.length', 4)
          })

        cy.get('button[type="submit"]').should('contain', 'Add question').click()
    })

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Competency')
        cy.get('td').eq(1).should('contain', 'Criteria A')
        cy.get('td').eq(2).should('contain', 'Sample question')
        cy.get('td').eq(3)
          .should('contain', 'Followup question 1')
          .should('contain', 'Followup question 2')
          .should('contain', 'Followup question 3')
      })

      cy.get('td').eq(4).find('button').click().parent().contains('Edit').click()

      cy.title().should('include', 'Sample question')
      cy.title().should('include', 'Edit question')

      cy.contains('Save question')
  })
})
