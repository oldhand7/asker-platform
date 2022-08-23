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

      cy.createOtherTextQuestion({ name: 'What is your favorite movie?' })

      cy.createDummyProject('Test project')

      cy.contains('Test project').closest('ul').listFirstRowNavigate('Edit')

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

      cy.get('[data-test-id="feature-company-presentation"]').drag('[data-test-id="stage-2"] .Droppable')
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
            .attachFile(['uploads/office-copy.jpg'])

          cy.get('.form-success').should('exist').should('contain', 'Upload success.')
        })

      cy.get('[data-test-id="feature-salary"]').drag('[data-test-id="stage-3"] .Droppable')
      cy.get('[data-test-id="feature-candidate-questions"]').drag('[data-test-id="stage-4"] .Droppable')
      cy.get('[data-test-id="feature-competency-questions"]').drag('[data-test-id="stage-5"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('button[data-test-id="add-question"]').first().click()
            cy.get('button[data-test-id="add-question"]').first().click()
        })

      cy.get('[data-test-id="feature-motivation-questions"]').drag('[data-test-id="stage-6"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('button[data-test-id="add-question"]').first().click()
        })

      cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-7"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
            cy.get('button[data-test-id="add-question"]').first().click()
            cy.get('button[data-test-id="add-question"]').first().click()
            cy.get('button[data-test-id="add-question"]').first().click()
        })

      cy.get('[data-test-id="feature-experience-questions"]').drag('[data-test-id="stage-8"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('button[data-test-id="add-question"]').first().click()
        })

      cy.get('[data-test-id="feature-hard-skill-questions"]').drag('[data-test-id="stage-9"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('button[data-test-id="add-question"]').first().click()
        })
      
      cy.get('[data-test-id="feature-culture-questions"]').drag('[data-test-id="stage-10"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.get('button[data-test-id="add-question"]').first().click()
        })

      cy.get('[data-test-id="feature-other-questions"]').drag('[data-test-id="stage-11"] .Droppable')
        .wait(1000)
      
      cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('button[data-test-id="add-question"]').first().click()
      })

      cy.get('[data-test-id="feature-summary"]').drag('[data-test-id="stage-12"] .Droppable')
        .wait(1000)

      cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]')
          .click()
          .wait(500)
          .type(LOREM_IPSUM)
      })

      cy.contains('Save project').click()

      cy.get('[data-test-id="alert-success"]').contains('Project saved')

      cy.contains('Test project')
        .closest('li')
        .within(() => {
          cy.get('[data-test-id="stage"]').eq(0).should('contain', 'Introduction')
          cy.get('[data-test-id="stage"]').eq(1).should('contain', 'Company')
          cy.get('[data-test-id="stage"]').eq(2).should('contain', 'Salary')
          cy.get('[data-test-id="stage"]').eq(3).should('contain', 'Candidate')
          cy.get('[data-test-id="stage"]').eq(4).should('contain', 'Competency')
          cy.get('[data-test-id="stage"]').eq(5).should('contain', 'Motivation')
          cy.get('[data-test-id="stage"]').eq(6).should('contain', 'Screening')
          cy.get('[data-test-id="stage"]').eq(7).should('contain', 'Experience')
          cy.get('[data-test-id="stage"]').eq(8).should('contain', 'Hard skill')
          cy.get('[data-test-id="stage"]').eq(9).should('contain', 'Culture')
          cy.get('[data-test-id="stage"]').eq(10).should('contain', 'Other')
          cy.get('[data-test-id="stage"]').eq(11).should('contain', 'Summary')
        })
    })
  })
  