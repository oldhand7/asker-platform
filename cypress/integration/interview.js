describe('Interview', () => {
  beforeEach(() => {
    cy.login('joe.arnolds@example.com', 'test123')
  })

  it('should rate interview', () => {
    cy.on('window:confirm', () => true)

    cy.createCompetencyQuestion({ name: 'Are you familiar with ISO standards?', criteria: { name: 'ISO-90210'} });
    cy.createExperienceQuestion({ name: 'Do you like traveling?', criteria: { name: 'Traveling'} });
    cy.createHardSkillQuestion({name: 'Comment MS Office experience', criteria: { name: 'MS Word'}});
    cy.createMotivationQuestion({ name : 'Does money motivate you?'});
    cy.createCultureQuestion({ name: 'Are you peoples person?'});
    cy.createScreeningChoiceQuestion({ name: 'Do you have drivers license?'})

    cy.createDummyProject('Some position X')

    cy.contains('Some position X').closest('li').listRowNavigate('Edit')

    cy.addStage('Competency')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Are you familiar with ISO standards?').closest('li').find('button').click()
      })
  
    cy.addStage('Experience')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Do you like traveling?').closest('li').find('button').click()
      })

    cy.addStage('Hard skill')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Comment MS Office experience').closest('li').find('button').click()
      })

    cy.addStage('Motivation')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Does money motivate you?').closest('li').find('button').click()
      })

    cy.addStage('Culture')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Are you peoples person?').closest('li').find('button').click()
      })


    cy.addStage('Screening')

    cy.get('[data-test-id="feature-form"]')
    .within(() => {
      cy.contains('Do you have drivers license?').closest('li').find('button').click()
    })

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')

    cy.contains('Some position X').closest('li').click()

    cy.get('[data-test-id="flex-table"]').should('contain', 'No candidates');

    cy.addProjectCandidate('John Smith', 'john.smith@hotmail.net')

    cy.contains('John Smith')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

    cy.get('#language-choose-modal').trigger('keyup', { code: "Escape" })

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'Competency')
      .should('contain', 'ISO-90210')
      .should('contain', 'Are you familiar with ISO standards?')
      .contains('Good').click()

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'Experience')
      .should('contain', 'Traveling')
      .should('contain', 'Do you like traveling?')
      .contains('Very experienced').click()

    cy.get('[data-test-id="feature-form"]').eq(3)
      .should('contain', 'Hard skill')
      .should('contain', 'MS Word')
      .should('contain', 'Comment MS Office experience')
      .contains('Master').click()

    cy.get('[data-test-id="feature-form"]').eq(4)
      .should('contain', 'Motivation')
      .should('contain', 'Does money motivate you?')
      .contains('Not motivated').click()

    cy.get('[data-test-id="feature-form"]').eq(5)
      .should('contain', 'Culture')
      .should('contain', 'Are you peoples person?')
      .contains('Low fit').click()

    cy.get('[data-test-id="feature-form"]').eq(6)
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

        cy.get('li').eq(1)
          .should('contain', 'No')
          .find('input[type="radio"]')
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

        cy.contains('Culture')
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

        cy.contains('Hard skill')
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
          .should('contain', 'Do you have drivers license?')
          .find('[data-test-id="pill-label"]').invoke('text')
          .should('contain', 'No')
    })
  })

 it('should have interview steps',  { scrollBehavior: 'center' }, () => {
    cy.createCompetencyQuestion({ name: 'Are you familiar with ISO-111?', criteria: { name: 'ISO-111'} });
    cy.createCompetencyQuestion({ name: 'Are you familiar with ISO-222?', criteria: { name: 'ISO-222'} });

    cy.createDummyProject('Some position Y')

    cy.contains('Some position Y').closest('li').listRowNavigate('Edit');

    cy.addStage('Competency')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Are you familiar with ISO-111?').closest('li').find('button').click()
        cy.contains('Are you familiar with ISO-222?').closest('li').find('button').click()
      })

    cy.addStage('Summary')

    cy.get('[data-test-id="feature-form"]')
      .findHtmlInputAndType("Lorem ipsum")

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved');

    cy.contains('Some position Y').closest('li').click()

    cy.addProjectCandidate('XOXO XIXI', 'xoxo.xixi@hotmail.net')

    cy.contains('XOXO XIXI')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

    cy.get('#language-choose-modal').trigger('keyup', { code: "Escape" })

    cy.location('pathname').should('contain', '/conduct/')

    cy.get('h1').should('contain', 'XOXO XIXI');

    cy.get('[data-test-id="interview-timer"]')
      .within(() => {
        cy.get('button').should('contain', 'Start timer (20m)').click()
        cy.get('button').should('contain', 'Pause timer')

        cy.contains('Project progress')
          .closest('div')
          .should('contain', '0%')
      })

    cy.contains('Process overview')
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
      .last()
      .click()

    cy.contains('Project progress')
      .closest('div')
      .should('contain', '100%')
  })

  it('should allow for language choosing when starting interview',  { scrollBehavior: 'center' }, () => {
    cy.createDummyProject('Some int position X')

    cy.contains('Some int position X').closest('li').click()

    cy.addProjectCandidate('AAA DDD', 'aaa.ddd@hotmail.net')

    cy.contains('AAA DDD')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()


    cy.location().then(loc => {
      let match = Cypress.minimatch(loc.pathname , '/interviews/*/conduct/', {
        matchBase: true,
      })

      expect(match).to.be.true
    })

    cy.get('#language-choose-modal')
      .within(() => {
        cy.root().should('contain', 'Choose language')

        cy.contains('English')
          .closest('[data-test-id="language-choose"]')
          .click()
          .wait(1000)
          .type('Swe{downArrow}{enter}')

        cy.get('button').contains('Choose').click()
      })

    cy.wait(2000)
    
    cy.location().then(loc => {
      let match = Cypress.minimatch(loc.pathname , '/se/interviews/*/conduct/', {
        matchBase: true,
      })

      expect(match).to.be.true
    })
  })
})
