describe('Modal froms', () => {
  beforeEach(() => {
    cy.login('joe.rogers@example.com', 'test123')
  })

  it('should create a competency question using modal', () => {
    cy.createDummyProject('Test project X')

    cy.contains('Test project X').closest('li').listRowNavigate('Edit')

    cy.addStage('Competency')

    cy.get('[data-test-id="feature-form"]').contains('Create').click()

    cy.get('#evaluation-question-modal')
      .should('exist')

    cy.get('form[data-test-id="evaluation-question-form"]')
      .should('contain', 'Create competency based question')
      .within(() => {
        cy.get('input[name="name.en"]').first().type('Sample question')

        cy.get('[data-test-id="html-input-field"]').first().click()
          .type('Sample question desc')

        cy.get('[data-test-id="criteria-option"]').as('criteria')
          .within(() => {
            cy.contains('Competency')
            cy.get('button').should('contain', 'Create new').click({ force: true})
          })

        cy.document().its('body')
          .find('#criteria-option-modal')
          .should('contain', 'Competency option')
          .within(() => {
            cy.get('input[name="name.en"]').type('Criteria A')
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

        cy.contains('Follow-up questions').closest('div')
          .within(() => {
              cy.contains('Add new follow-up question').click()
              cy.get('input').type('Followup question 1{enter}')
              cy.contains('Add new follow-up question').click()
              cy.get('input').type('Followup question 2{enter}')
              cy.contains('Add new follow-up question').click()
              cy.get('input').type('Followup question 3{enter}')

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

      cy.get('[data-test-id="question-manager"]')
        .should('contain', 'Sample question')

      cy.saveProject()

      cy.visit('/questions/')

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
  })

  it('should create a Yes/No screening question using modal', () => {
    cy.createDummyProject('Test project Y')

    cy.contains('Test project Y').closest('li').listRowNavigate('Edit')

    cy.addStage('Screening')

    cy.get('[data-test-id="feature-form"]').contains('Create').click()

    cy.get('#screening-question-modal').should('exist')

    cy.get('[data-test-id="screening-question-form"]')
      .within(() => {
        cy.contains('Yes/No').click()

        cy.get('[data-test-id="title"]')
          .should('contain', 'Create a screening question')
          .should('contain', 'Yes/No')

        cy.get('[data-test-id="choice-question-form"]')
          .within(() => {
            cy.get('input[name="name.en"]').type('Do you like fruits?')

            cy.get('[data-test-id="html-input-field"]').click()
              .type('Fruits fruits fruits')

            cy.get('[data-test-id="answers-form"]')
              .find('ul')
              .within(() => {
                cy.get('li').eq(0).find('input[name="answers[0].name.en"]').type('Yes{enter}')
                cy.get('li').eq(1).find('input[name="answers[1].name.en"]').type('No')
              })
              .children()
              .should('have.length', 2)
          })

          cy.contains("Create question").click()
      })

    cy.get('[data-test-id="question-manager"]')
      .should('contain', 'Do you like fruits?')

    cy.saveProject();

    cy.visit('/questions/')

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Screening').should('contain', 'Yes/No')
        cy.get('td').eq(2).should('contain', 'Do you like fruits?')
      })
  })

  it('should create a text question using modal', () => {
    cy.createDummyProject('Test project Z')

    cy.contains('Test project Z').closest('li').listRowNavigate('Edit')

    cy.addStage('Other')

    cy.get('[data-test-id="feature-form"]').contains('Create').click()

    cy.get('#other-question-modal').should('exist')

    cy.get('[data-test-id="other-question-form"]')
      .within(() => {
        cy.root().should('contain', 'Create other question')

        cy.contains('Text').click()

        cy.get('[data-test-id="text-question-form"]')
          .within(() => {
            cy.get('input[name="name.en"]').type("What's your favorite movie character?")
            cy.root().findHtmlInputAndType('Character character character.')
          })

          cy.contains("Create question").click()
      })

    cy.get('[data-test-id="question-manager"]')
      .should('contain', "What's your favorite movie character?")

    cy.saveProject();
    
    cy.visit('/questions/')

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Other').should('contain', 'Text')
        cy.get('td').eq(2).should('contain', "What's your favorite movie character?")
      })
  })
})
