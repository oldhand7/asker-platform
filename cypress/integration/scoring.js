describe('Scoring', () => {
  beforeEach(() => {
    cy.login('joe.kaunas@example.com', 'test123')
    cy.viewport(1200, 800)
  })

  it('should score with adjusted layer', () => {
    cy.on('window:confirm', () => true)

    cy.createCompetencyQuestion({ name: 'Are you familiar with ISO standards?', criteria: { name: 'ISO-90210'} });
    cy.createMotivationQuestion({ name : 'Does money motivate you?'});

    cy.createDummyProject('Some position X')

    cy.contains('Some position X')
      .closest('ul')
      .listFirstRowNavigate('Edit')

    cy.addStage('Competency')

    cy.get('[data-test-id="feature-form"]')
      .should('contain', 'Competency')
      .contains('Are you familiar with ISO standards?')
      .closest('li')
      .find('button')
      .click()

    cy.addStage('Motivation')

    cy.get('[data-test-id="feature-form"]')
    .should('contain', 'Motivation')
    .contains('Does money motivate you?')
    .closest('li')
    .find('button')
    .click()

    cy.get('[data-test-id="project-evaluation-criteria"]')
      .within(() => {
        cy.contains('Motivation').parent().should('contain', '50%')
        cy.contains('Competency').parent().should('contain', '50%')
          .parent()
          .find('ul').within(() => {
            cy.get('li').should('have.length', 1);
            cy.get('li').eq(0).should('contain', 'ISO-90210').should('contain', '50%')
          })
      })
      .find('[data-test-id="edit-button"]')
      .click()

    cy.get('[role="dialog"]')
      .within(() => {
        cy.contains('ISO-90210').closest('tr').find('input').type('{selectAll}{backspace}20')
        cy.contains('Motivation').closest('tr').find('input').type('{selectAll}{backspace}80')

        cy.contains('Save').click()
      })
      .wait(1000)

    cy.get('[data-test-id="project-evaluation-criteria"]')
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

    cy.contains('Some position X').closest('li').click()

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
      .contains('Competency')
      .closest('[data-test-id="interview-details-row"]')
      .should('contain', '100%')
      .click()
      .within(() => {
        cy.contains('ISO-90210')
          .closest('li')
          .find('[data-test-id="criteria-rating"]').invoke('text')
          .should('contain', '5')
      })
  })

  it('should score with adjusted layer (46)', () => {
    cy.on('window:confirm', () => true)

    cy.createCompetencyQuestion({ name: 'QM1', criteria: { name: 'XCM'} });
    cy.createCompetencyQuestion({ name: 'QM2', criteria: { name: 'XCM', create: false } });
    cy.createCompetencyQuestion({ name: 'QR1', criteria: { name: 'XCR'} }, );
    cy.createCompetencyQuestion({ name: 'QR2', criteria: { name: 'XCR', create: false } });
    cy.createCompetencyQuestion({ name: 'QS1', criteria: { name: 'XCS'} });

    cy.createDummyProject('Some position Y')

    cy.contains('Some position Y')
      .closest('ul')
      .listFirstRowNavigate('Edit')

    cy.addStage('Competency')
      .wait(1000)

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('input[name="q"]').type('X')
        cy.get('ul li button').click({multiple: true})
      })

    cy.get('[data-test-id="project-evaluation-criteria"]')
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
      .find('[data-test-id="edit-button"]')
      .click()

    cy.get('[role="dialog"]')
      .within(() => {
        cy.contains('XCM').closest('tr').find('input').type('{selectAll}{backspace}30')
        cy.contains('XCR').closest('tr').find('input').type('{selectAll}{backspace}50')
        cy.contains('XCS').closest('tr').find('input').type('{selectAll}{backspace}20')

        cy.contains('Save').click()
      })

    cy.get('[data-test-id="project-evaluation-criteria"]')
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

    cy.contains('Some position Y').closest('li').click()

    cy.addProjectCandidate('John Smith', 'john.smith@hotmail.net')
      .wait(1000)

    cy.contains('John Smith')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

    cy.contains('QM1').closest('[data-test-id="feature-form"]')
      .contains('Excellent').click()

    cy.contains('QM2').closest('[data-test-id="feature-form"]')
      .contains('Good').click()

    cy.contains('QR1').closest('[data-test-id="feature-form"]')
      .contains('Good').click()

    cy.contains('QR2').closest('[data-test-id="feature-form"]')
      .contains('Fair').click()

    cy.contains('QS1').closest('[data-test-id="feature-form"]')
      .contains('Fair').click()

    cy.contains('Complete interview').click()

    cy.get('[data-test-id="flex-table-row"]')
      .first()
      .should('contain', '46%')
      .click()
      .contains('Competency')
      .closest('[data-test-id="interview-details-row"]')
      .should('contain', '50%')
      .click()
      .within(() => {
        cy.get('li')
          .should('have.length', 3)

        cy.get('li').eq(0)
          .should('contain', 'XCM')
          .find('[data-test-id="criteria-rating"]').invoke('text')
          .should('contain', '4')

        cy.get('li').eq(1)
          .should('contain', 'XCR')
          .find('[data-test-id="criteria-rating"]').invoke('text')
          .should('contain', '3')

        cy.get('li').eq(2)
          .should('contain', 'XCS')
          .find('[data-test-id="criteria-rating"]').invoke('text')
          .should('contain', '2')
      })
  })
})
