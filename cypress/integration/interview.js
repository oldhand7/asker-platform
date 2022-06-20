describe('Interview', () => {
  beforeEach(() => {
    cy.login('joe.arnolds@example.com', 'test123')
  })

  it('should rate interview', () => {
    cy.on('window:confirm', () => true)

    cy.createChoiceQuestion('Do you have drivers license?')
    cy.createEvaluationQuestion('motivation', { name : 'Does money motivate you?'});
    cy.createEvaluationQuestion('culture-fit', { name: 'Are you peoples person?'});
    cy.createEvaluationCriteriaQuestion('competency', { name: 'Are you familiar with ISO standards?', criteria: 'ISO-90210' });
    cy.createEvaluationCriteriaQuestion('experience', { name: 'Do you like traveling?', criteria: 'Traveling' });
    cy.createEvaluationCriteriaQuestion('hard-skill', {name: 'Comment MS Office experience', criteria: 'MS Word'});

    cy.createDummyProject('Some position')
    cy.tableFirstRowNavigate('Edit');

    cy.contains('Add stage')
      .click()
      .click()
      .click()
      .click()
      .click()

    cy.get('[data-test-id="stage-1"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Motivation').click()
    cy.get('[data-test-id="feature-form"]')
      .find('table').first()
      .find('button[data-test-id="add-question"]').first()
      .click()

    cy.get('[data-test-id="stage-2"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Culture-fit').click()
    cy.get('[data-test-id="feature-form"]')
      .find('table').first()
      .find('button[data-test-id="add-question"]').first()
      .click()

    cy.get('[data-test-id="stage-3"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Competency').click()
    cy.get('[data-test-id="feature-form"]')
      .find('table').first()
      .find('button[data-test-id="add-question"]').first()
      .click()

    cy.get('[data-test-id="stage-4"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Experience').click()
    cy.get('[data-test-id="feature-form"]')
      .find('table').first()
      .find('button[data-test-id="add-question"]').first()
      .click()

    cy.get('[data-test-id="stage-5"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Hard').click()
    cy.get('[data-test-id="feature-form"]')
      .find('table').first()
      .find('button[data-test-id="add-question"]').first()
      .click()

    cy.get('[data-test-id="stage-6"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Screening').click()
    cy.get('[data-test-id="feature-form"]')
      .find('table').first()
      .find('button[data-test-id="add-question"]').first()
      .click()

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').contains('Project saved')

    cy.get('table tbody tr').first().click()

    cy.get('[data-test-id="flex-table"]').should('contain', 'No interviews');

    cy.addProjectCandidate('John Smith', 'john.smith@hotmail.net')


    cy.contains('John Smith')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'Motivation')
      .should('contain', 'Does money motivate you?')
      .contains('Not motivated').click()

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'Culture-fit')
      .should('contain', 'Are you peoples person?')
      .contains('Low fit').click()

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'Competency')
      .should('contain', 'ISO-90210')
      .should('contain', 'Are you familiar with ISO standards?')
      .contains('Good').click()

    cy.get('[data-test-id="feature-form"]').eq(3)
      .should('contain', 'Experience')
      .should('contain', 'Traveling')
      .should('contain', 'Do you like traveling?')
      .contains('Very experienced').click()

    cy.get('[data-test-id="feature-form"]').eq(4)
      .should('contain', 'Hard')
      .should('contain', 'MS Word')
      .should('contain', 'Comment MS Office experience')
      .contains('Master').click()

    cy.get('[data-test-id="feature-form"]').eq(5)
      .should('contain', 'Screening')
      .should('contain', 'Do you have drivers license?')
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

    cy.contains('Complete interview').click()

    cy.get('[data-test-id="flex-table-row"]')
      .first()
      .should('contain', '50%')
      .click()
      .within(() => {
        cy.contains('Competency')
          .closest('[data-test-id="interview-details-row"]')
          .should('contain', '10%')
          .click()
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'ISO-90210')
              .find('[data-test-id="criteria-rating"]').invoke('text')
              .should('contain', '3')
          })

        cy.contains('Culture-fit')
          .closest('[data-test-id="interview-details-row"]')
          .should('contain', '5%')

        cy.contains('Experience')
          .closest('[data-test-id="interview-details-row"]')
          .should('contain', '15%')
          .click()
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'Traveling')
              .find('[data-test-id="criteria-rating"]').invoke('text')
              .should('contain', '4')
          })

        cy.contains('Hard-skill')
          .closest('[data-test-id="interview-details-row"]')
          .should('contain', '20%')
          .click()
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'MS Word')
              .find('[data-test-id="criteria-rating"]').invoke('text')
              .should('contain', '5')
          })


        cy.contains('Screening')
          .closest('[data-test-id="interview-details-row"]')
          .click()
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'Do you have drivers license?')
              .find('[data-test-id="pill-label"]').invoke('text')
              .should('contain', 'No')
          })

      })

  })
})
