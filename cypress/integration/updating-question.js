describe('Updating queestions', () => {
  beforeEach(() => {
      cy.login('joe.barbara@example.com', 'test123')
  })

  it('should sync project questions with questions', () => {
      cy.createOtherTextQuestion({ name: 'Question 123'})

      cy.createDummyProject('Project 123')

      cy.contains('Project 123').closest('ul').listFirstRowNavigate('Edit')
 
      cy.addStage('Other')

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('[data-test-id="question-manager"]')
            .should('not.contain', 'Question 123')

          cy.get('[data-test-id="question-explorer"] ul').last()
            .contains('Question 123')
            .closest('li')
            .find('button')
            .click()

            cy.get('[data-test-id="question-manager"]')
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

      cy.get('input[name="name.en"]').first().type('{selectAll}{backspace}Questione 111')

      cy.contains('Save question').click()

      cy.get('[data-test-id="alert-success"]')
        .contains('Question saved')

      cy.visit('/projects')

      cy.contains('Project 123').closest('li').listRowNavigate('Edit')

      cy.contains('Other (1)').click()

      cy.get('[data-test-id="feature-form"] [data-test-id="question-manager"]')
        .should('contain', 'Questione 111')

      cy.visit('/projects')

      cy.contains('Project 123').closest('li').click()

      cy.contains('Start interview').click()

      cy.get('[data-test-id="feature-form"]').eq(1)
        .should('contain', 'Questione 111')
  })

  it('should sync template questions with questions', () => {
      cy.createOtherTextQuestion({ name: 'Question ABC'})

      cy.createDummyTemplate('Project ABC')

      cy.contains('Project ABC')
        .closest('ul')
        .listFirstRowNavigate('Edit')


      cy.addStage('Other')

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('[data-test-id="question-manager"]')
            .should('not.contain', 'Question ABC')

          cy.get('[data-test-id="question-explorer"] ul').last()
            .contains('Question ABC')
            .closest('li')
            .find('button')
            .click()

            cy.get('[data-test-id="question-manager"]')
            .should('contain', 'Question ABC')
        })

      cy.contains('Save template').click()

      cy.get('[data-test-id="alert-success"]')
        .contains('Template saved')

      cy.visit('/questions')

      cy.tableFirstRowNavigate('Edit')

      cy.get('input[name="name.en"]').first().type('{selectAll}{backspace}Questione 222')

      cy.contains('Save question').click()

      cy.get('[data-test-id="alert-success"]')
        .contains('Question saved')

      cy.visit('/templates')

      cy.contains('Project ABC')
        .closest('ul')
        .listFirstRowNavigate('Edit')

      cy.contains('Other (1)').click()

      cy.get('[data-test-id="feature-form"] [data-test-id="question-manager"]')
        .should('contain', 'Questione 222')
  })
})
