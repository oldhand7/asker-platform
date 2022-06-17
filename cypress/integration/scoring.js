describe('Scoring', () => {
  beforeEach(() => {
    cy.login('joe.kaunas@example.com', 'test123')
    cy.viewport(1200, 800)
  })

  it('should score with adjusted layer', () => {
    cy.on('window:confirm', () => true)

    cy.createEvaluationCriteriaQuestion('competency', { name: 'Are you familiar with ISO standards?', criteria: 'ISO-90210' });
    cy.createEvaluationQuestion('motivation', { name : 'Does money motivate you?'});

    cy.createDummyProject('Some position')

    cy.tableFirstRowNavigate('Edit');

    cy.contains('Add stage').click()

    cy.get('[data-test-id="stage-2"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Competency').click().wait(1000)
    cy.get('[data-test-id="feature-form"]')
      .find('table tbody tr')
      .first()
      .find('button')
      .click()

    cy.contains('Add stage').click()

    cy.get('[data-test-id="stage-3"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Motivation').click().wait(1000)
    cy.get('[data-test-id="feature-form"]')
      .find('table tbody tr')
      .first()
      .find('button')
      .click()

    cy.contains('Evaluation Criteria').parent()
      .within(() => {
        cy.contains('Motivation').parent().should('contain', '50%')
        cy.contains('Competency').parent().should('contain', '50%')
          .parent()
          .find('ul').within(() => {
            cy.get('li').should('have.length', 1);
            cy.get('li').eq(0).should('contain', 'ISO-90210').should('contain', '50%')
          })
      })
      .contains('Edit')
      .click()

    cy.get('[role="dialog"]')
      .within(() => {
        cy.contains('ISO-90210').closest('tr').find('input').type('{selectAll}{backspace}20')
        cy.contains('Motivation').closest('tr').find('input').type('{selectAll}{backspace}80')

        cy.contains('Save').click()
      })
      .wait(1000)

    cy.contains('Evaluation Criteria').parent()
      .within(() => {
        cy.contains('Motivation').parent().should('contain', '80%')
        cy.contains('Competency').parent().should('contain', '20%')
          .parent()
          .find('ul').within(() => {
            cy.get('li').should('have.length', 1);
            cy.get('li').eq(0).should('contain', 'ISO-90210').should('contain', '20%')
          })
      })

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').contains('Project saved')

    cy.get('table tbody tr').first().click()

    cy.addProjectCandidate('John Smith', 'john.smith@hotmail.net')
      .wait(1000)



    cy.contains('John Smith')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'Competency')
      .should('contain', 'ISO-90210')
      .should('contain', 'Are you familiar with ISO standards?')
      .contains('Excellent').click()

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'Motivation')
      .should('contain', 'Does money motivate you?')
      .contains('Not motivated').click()

    cy.contains('Complete interview').click()

    cy.get('[data-test-id="flex-table-row"]')
      .first()
      .click()
      .within(() => {
        cy.get('[data-test-id="flex-table-column"]').eq(1).should('contain', '20%')

        cy.get('[data-test-id="evaluation-score"]').eq(0)
          .should('have.attr', 'data-score', '5')
          .should('contain', 'ISO-90210')

        cy.get('[data-test-id="evaluation-score"]').eq(1)
          .should('have.attr', 'data-score', '1')
          .should('contain', 'Motivation')
      })
  })

  it('should score with adjusted layer (46)', () => {
    cy.on('window:confirm', () => true)

    cy.createEvaluationCriteriaQuestion('competency', { name: 'QM1', criteria: 'XCM' });
    cy.createEvaluationCriteriaQuestion('competency', { name: 'QM2', criteria: 'XCM' }, false);
    cy.createEvaluationCriteriaQuestion('competency', { name: 'QR1', criteria: 'XCR' }, );
    cy.createEvaluationCriteriaQuestion('competency', { name: 'QR2', criteria: 'XCR' }, false);
    cy.createEvaluationCriteriaQuestion('competency', { name: 'QS1', criteria: 'XCS' });

    cy.createDummyProject('Some position')

    cy.tableFirstRowNavigate('Edit');

    cy.contains('Add stage').click()

    cy.get('[data-test-id="stage-2"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Competency').click().wait(1000)
    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('input').first().type('X')

        cy.get('table tbody tr').first().find('button').click()
        cy.get('table tbody tr').first().find('button').click()
        cy.get('table tbody tr').first().find('button').click()
        cy.get('table tbody tr').first().find('button').click()
        cy.get('table tbody tr').first().find('button').click()
      })

    cy.contains('Evaluation Criteria').parent()
        .within(() => {
          cy.contains('Competency').parent().should('contain', '100%')
            .parent()
            .find('ul').within(() => {
              cy.get('li').should('have.length', 3);
              cy.get('li').eq(0).should('contain', 'XCM').should('contain', '40%')
              cy.get('li').eq(1).should('contain', 'XCR').should('contain', '40%')
              cy.get('li').eq(2).should('contain', 'XCS').should('contain', '20%')
            })
        })
      .contains('Edit')
      .click()

    cy.get('[role="dialog"]')
      .within(() => {
        cy.contains('XCM').closest('tr').find('input').type('{selectAll}{backspace}30')
        cy.contains('XCR').closest('tr').find('input').type('{selectAll}{backspace}50')
        cy.contains('XCS').closest('tr').find('input').type('{selectAll}{backspace}20')

        cy.contains('Save').click()
      })

    cy.contains('Evaluation Criteria').parent()
      .within(() => {
        cy.contains('Competency').parent().should('contain', '100%')
          .parent()
          .find('ul').within(() => {
            cy.get('li').should('have.length', 3);
            cy.get('li').eq(0).should('contain', 'XCR').should('contain', '50%')
            cy.get('li').eq(1).should('contain', 'XCM').should('contain', '30%')
            cy.get('li').eq(2).should('contain', 'XCS').should('contain', '20%')
          })
        })

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').contains('Project saved')

    cy.get('table tbody tr').first().click()

    cy.addProjectCandidate('John Smith', 'john.smith@hotmail.net')
      .wait(1000)

    cy.contains('John Smith')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

    cy.contains('QM1').closest('[data-test-id="evaluation-question-int"]')
      .contains('Excellent').click()

    cy.contains('QM2').closest('[data-test-id="evaluation-question-int"]')
      .contains('Good').click()

    cy.contains('QR1').closest('[data-test-id="evaluation-question-int"]')
      .contains('Good').click()

    cy.contains('QR2').closest('[data-test-id="evaluation-question-int"]')
      .contains('Fair').click()

    cy.contains('QS1').closest('[data-test-id="evaluation-question-int"]')
      .contains('Fair').click()

    cy.contains('Complete interview').click()

    cy.get('[data-test-id="flex-table-row"]')
      .first()
      .click()
      .within(() => {
        cy.get('[data-test-id="flex-table-column"]').eq(1).should('contain', '46%')

        cy.get('[data-test-id="evaluation-score"]')
          .should('have.length', 3)

        cy.get('[data-test-id="evaluation-score"]').eq(0)
          .should('have.attr', 'data-score', '4')
          .should('contain', 'XCM')

        cy.get('[data-test-id="evaluation-score"]').eq(1)
          .should('have.attr', 'data-score', '3')
          .should('contain', 'XCR')

        cy.get('[data-test-id="evaluation-score"]').eq(2)
          .should('have.attr', 'data-score', '2')
          .should('contain', 'XCS')
      })
  })
})
