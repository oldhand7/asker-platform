describe('Interview', () => {
  beforeEach(() => {
    cy.login('joe.arnolds@example.com', 'test123')
  })

  it('should rate interview', () => {
    cy.on('window:confirm', () => true)

    cy.createScreeningChoiceQuestion({ name: 'Do you have drivers license?'})
    cy.createMotivationQuestion({ name : 'Does money motivate you?'});
    cy.createCultureFitQuestion({ name: 'Are you peoples person?'});
    cy.createCompetencyQuestion({ name: 'Are you familiar with ISO standards?', criteria: { name: 'ISO-90210'} });
    cy.createExperienceQuestion({ name: 'Do you like traveling?', criteria: { name: 'Traveling'} });
    cy.createHardSkillQuestion({name: 'Comment MS Office experience', criteria: { name: 'MS Word'}});

    cy.createDummyProject('Some position X')

    cy.contains('Some position X')
      .closest('ul')
      .listFirstRowNavigate('Edit')

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

    cy.contains('Some position X').closest('li').click()

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
          .should('contain', '50%')
          .click()
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'ISO-90210')
              .find('[data-test-id="criteria-rating"]').invoke('text')
              .should('contain', '3')
          })

        cy.contains('Culture-fit')
          .closest('[data-test-id="interview-details-row"]')
          .should('contain', '25%')

        cy.contains('Experience')
          .closest('[data-test-id="interview-details-row"]')
          .should('contain', '75%')
          .click()
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'Traveling')
              .find('[data-test-id="criteria-rating"]').invoke('text')
              .should('contain', '4')
          })

        cy.contains('Hard-skill')
          .closest('[data-test-id="interview-details-row"]')
          .should('contain', '100%')
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
  
  it('should have interview steps',  { scrollBehavior: 'center' }, () => {
    cy.createCompetencyQuestion({ name: 'Are you familiar with ISO-111?', criteria: { name: 'ISO-111'} });
    cy.createCompetencyQuestion({ name: 'Are you familiar with ISO-222?', criteria: { name: 'ISO-222'} });
    
    cy.createDummyProject('Some position Y')

    cy.contains('Some position Y')
      .closest('ul')
      .listFirstRowNavigate('Edit')

    cy.contains('Add stage')
      .click()
      .click()

    cy.get('[data-test-id="stage-2"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Competency').click()
    cy.get('[data-test-id="feature-form"]')
      .find('table').first()
      .within(() => {
        cy.contains('ISO-111').closest('tr').find('[data-test-id="add-question"]').click()
        cy.contains('ISO-222').closest('tr').find('[data-test-id="add-question"]').click()
      })

    cy.get('[data-test-id="stage-3"] [data-test-id="load-button"]').click()
    cy.get('#feature-select-modal').contains('Summary').click()

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved');

    cy.contains('Some position Y').closest('li').click()

    cy.addProjectCandidate('XOXO XIXI', 'xoxo.xixi@hotmail.net')

    cy.contains('XOXO XIXI')
      .first()
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()
    
    cy.location('pathname').should('contain', '/conduct/')
    
    cy.get('h1').should('contain', 'XOXO XIXI');

    cy.get('[data-test-id="interview-timer"]')
      .within(() => {
        cy.get('button').should('contain', 'Start timer (20 min)').click()
        cy.get('button').should('contain', 'Pause timer')

        cy.contains('Project progress')
          .closest('div')
          .should('contain', '0%')
      })
    
    cy.contains('Process overview')
      .click()
      .closest('div[data-test-id="interview-process-overview"]')
      .within(() => {
        cy.contains('Questions').closest('div')
          .should('contain', 2)
        
        cy.get('ul')
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'In progress')
              .should('contain', 'Introduction')

            cy.get('li').eq(1)
              .should('contain', 'Not started')
              .should('contain', 'ISO-111')

            cy.get('li').eq(2)
              .should('contain', 'Not started')
              .should('contain', 'ISO-222')

            cy.get('li').eq(3)
              .should('contain', 'Not started')
              .should('contain', 'Summary')
          })
        })

    
    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'Introduction')
    
    cy.contains('Next step').click()

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'Competency')
      .should('contain', 'Are you familiar with ISO-111?')
      .within(() => {
        cy.contains('Good').click()
      })

    cy.contains('Next step').click()

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'Competency')
      .should('contain', 'Are you familiar with ISO-222?')
      .within(() => {
        cy.contains('Good').click()
      })

    cy.contains('Next step').click().wait(1000)
    
    cy.get('[data-test-id="feature-form"]').eq(3)
      .should('contain', 'Summary')

    cy.contains('Project progress')
      .closest('div')
      .should('contain', '75%')

    cy.contains('Process overview')
      .closest('div[data-test-id="interview-process-overview"]')
      .within(() => {
        cy.contains('Questions').closest('div')
          .should('contain', 0)
        
        cy.get('ul')
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'Completed')
              .should('contain', 'Introduction')

            cy.get('li').eq(1)
              .should('contain', 'Completed')
              .should('contain', 'ISO-111')

            cy.get('li').eq(2)
              .should('contain', 'Completed')
              .should('contain', 'ISO-222')

            cy.get('li').eq(3)
              .should('contain', 'In progress')
              .should('contain', 'Summary')
          })
      })

    cy.contains('Complete interview').click()

    cy.location('pathname').should('contain', '/overview/')

    cy.contains('XOXO XIXI')
      .closest('[data-test-id="flex-table-row"]')
      .find('[data-test-id="edit-button"]')
      .click()

    cy.contains('Project progress')
      .closest('div')
      .should('contain', '100%')
  })

})
