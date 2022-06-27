const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc congue nisi vitae suscipit tellus mauris a diam.';
//@TODO https://www.npmjs.com/package/lorem-ipsum

describe('Stages', () => {
    beforeEach(() => {
      cy.login('joe.johnson@example.com', 'test123')
    })
  
    it('should create all stage project', () => {
      cy.createCompetencyQuestion({ name: 'Are you familiar with C1?', criteria: { name: 'C1', create: true }})
      cy.createCompetencyQuestion({ name: 'Are you familiar with C2?', criteria: { name: 'C2', create: true }})
      cy.createExperienceQuestion({ name: 'Have you done skydiving?', criteria: { name: 'Skydiving', create: true }});
      cy.createHardSkillQuestion({ name: 'Are you familiar with MS Word?', criteria: { name: 'MS Word', create: true}});
      cy.createMotivationQuestion({ name: 'Does money motivate you?' })
      cy.createCultureFitQuestion({ name: 'How well you integrate into new teams?' })

      cy.createScreeningChoiceQuestion({
        name: 'Do you like fruits?'
      })

      cy.createScreeningChoiceQuestion({
        name: 'What music do you like?',
        choices: ['Pop', 'Rock', 'Classical', 'RAP'],
        multichoice: true
      })

      cy.createScreeningRangeQuestion({
        name: 'What is your salary expectation?',
        desc: '',
        min: 1000,
        max: 5000,
        step: 100,
        unit: '$'
      })

      cy.createScreeningTextQuestion({ name: 'Tell us about your best years' })

      cy.createOtherChoiceQuestion({
        name: 'Do you like traveling?'
      })

      cy.createOtherChoiceQuestion({
        name: 'Where have you been',
        choices: ['UK', 'France', 'Netherlands', 'Germany', 'Other'],
        multichoice: true
      })

      cy.createOtherRangeQuestion({
        name: 'How old are Egypt pyramids?',
        desc: '',
        min: 0,
        max: 10000,
        step: 1000,
        unit: 'Y.O.'
      })

      cy.createOtherTextQuestion({ name: 'What is your favorite movie?' })

      cy.createDummyProject('Test project')

      cy.tableFirstRowNavigate('Edit')

      cy.get('[data-test-id="stage-1"]').click()
  
      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('[contenteditable="true"]')
            .click()
            .wait(500)
            .type(LOREM_IPSUM)
        })
      
      cy.contains('Add stage')
        .click()
        .click()
        .click()
        .click()
        .click()
        .click()
        .click()
        .click()
        .click()
        .click()
        .click()
        .click()

      cy.get('[data-test-id="feature-team-role-presentation"]').drag('[data-test-id="stage-2"] .Droppable')

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('[contenteditable="true"]')
              .click()
              .wait(500)
              .type(LOREM_IPSUM)
          
            cy.get('[data-test-id="file-upload-area"]')
              .find('input[type="file"]')
              .first()
              .attachFile(['uploads/office.jpg'])

            cy.get('.form-success').should('exist').should('contain', 'Upload success.')
          })

      cy.get('[data-test-id="feature-company-presentation"]').drag('[data-test-id="stage-3"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('[contenteditable="true"]')
            .click()
            .wait(500)
            .type(LOREM_IPSUM)

          cy.get('[data-test-id="file-upload-area"]')
            .find('input[type="file"]')
            .first()
            .attachFile(['uploads/office.jpg'])

          cy.get('.form-success').should('exist').should('contain', 'Upload success.')
        })

      cy.get('[data-test-id="feature-salary"]').drag('[data-test-id="stage-4"] .Droppable')
      cy.get('[data-test-id="feature-candidate-questions"]').drag('[data-test-id="stage-5"] .Droppable')
      cy.get('[data-test-id="feature-competency-questions"]').drag('[data-test-id="stage-6"] .Droppable')

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('table').first()
            .within(() => {
              cy.get('button').first().click()
              cy.get('button').first().click()
            })
        })

      cy.get('[data-test-id="feature-motivation-questions"]').drag('[data-test-id="stage-7"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('table').first()
            .within(() => {
              cy.get('button').first().click()
            })
        })

      cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-8"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('table').first()
            .within(() => {
              cy.get('button').first().click()
              cy.get('button').first().click()
              cy.get('button').first().click()
              cy.get('button').first().click()
            })
        })

      cy.get('[data-test-id="feature-experience-questions"]').drag('[data-test-id="stage-9"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('table').first()
            .within(() => {
              cy.get('button').first().click()
            })
        })

      cy.get('[data-test-id="feature-hard-skill-questions"]').drag('[data-test-id="stage-10"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('table').first()
            .within(() => {
              cy.get('button').first().click()
            })
        })
      
      cy.get('[data-test-id="feature-culture-fit-questions"]').drag('[data-test-id="stage-11"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('table').first()
            .within(() => {
              cy.get('button').first().click()
            })
        })

      cy.get('[data-test-id="feature-other-questions"]').drag('[data-test-id="stage-12"] .Droppable')
        .wait(1000)
      
      cy.get('[data-test-id="feature-form"]')
      .within(() => {
          cy.get('table').first()
          .within(() => {
            cy.get('button').first().click()
            cy.get('button').first().click()
            cy.get('button').first().click()
            cy.get('button').first().click()
          })
      })

      cy.get('[data-test-id="feature-summary"]').drag('[data-test-id="stage-13"] .Droppable')

      cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]')
          .click()
          .wait(500)
          .type(LOREM_IPSUM)
      })

      cy.contains('Save project').click()
    })
  })
  