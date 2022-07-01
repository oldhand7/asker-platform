describe('Updating queestions', () => {
  beforeEach(() => {
      cy.login('joe.barbara@example.com', 'test123')
  })

  it('should sync project questions with questions', () => {
      cy.createTextQuestion('Question 123')

      cy.createDummyProject('Project 123')

      cy.contains('Project 123').closest('ul').listFirstRowNavigate('Edit')

      cy.contains('Add stage')
        .click()

      cy.get('[data-test-id="feature-screening-questions"]')
        .drag('[data-test-id="stage-2"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('table tbody').last()
            .should('not.contain', 'Question 123')

          cy.get('table tbody').first()
            .contains('Question 123')
            .closest('tr')
            .find('button')
            .click()

          cy.get('table tbody').last()
            .should('contain', 'Question 123')
        })

      cy.contains('Save project').click()

      cy.get('[data-test-id="alert-success"]').contains('Project saved')

      cy.contains('Project 123').closest('li').click()

      cy.addProjectCandidate('Fernando', 'fernando@arerez.net').wait(1000)

      cy.contains('Start interview').click()

      cy.get('[data-test-id="feature-form"]').eq(1)
        .should('contain', 'Question 123')

      cy.visit('/questions')

      cy.tableFirstRowNavigate('Edit')

      cy.get('input[name="name"]').first().type('{selectAll}{backspace}Questione 111')

      cy.contains('Save question').click()

      cy.get('[data-test-id="alert-success"]')
        .contains('Question saved').wait(1000)

      cy.visit('/projects')

      cy.contains('Project 123').closest('ul').listFirstRowNavigate('Edit')

      cy.get('[data-test-id="stage-2"]').click()

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('table tbody').last()
            .should('contain', 'Questione 111')
        })

      cy.visit('/projects')

      cy.contains('Project 123').closest('li').click()

      cy.contains('Start interview').click()

      cy.get('[data-test-id="feature-form"]').eq(1)
        .should('contain', 'Questione 111')
  })

  it('should sync template questions with questions', () => {
      cy.createTextQuestion('Question ABC')

      cy.createDummyTemplate('Project ABC')

      cy.contains('Project ABC')
        .closest('ul')
        .listFirstRowNavigate('Edit')

      cy.contains('Add stage').click()

      cy.get('[data-test-id="feature-screening-questions"]')
        .drag('[data-test-id="stage-2"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('table tbody').last()
            .should('not.contain', 'Question ABC')

          cy.get('table tbody').first()
            .contains('Question ABC')
            .closest('tr')
            .find('button')
            .click()

          cy.get('table tbody').last()
            .should('contain', 'Question ABC')
        })

      cy.contains('Save template').click()

      cy.get('[data-test-id="alert-success"]')
        .contains('Template saved')

      cy.visit('/questions')

      cy.tableFirstRowNavigate('Edit')

      cy.get('input[name="name"]').first().type('{selectAll}{backspace}Questione 222')

      cy.contains('Save question').click()

      cy.get('[data-test-id="alert-success"]')
        .contains('Question saved').wait(1000)

      cy.visit('/templates')

      cy.contains('Project ABC')
      .closest('ul')
      .listFirstRowNavigate('Edit')

      cy.get('[data-test-id="stage-2"]').click()

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('table tbody').last()
            .should('contain', 'Questione 222')
        })
  })
})
