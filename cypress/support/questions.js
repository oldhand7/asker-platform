const createTextQuestion = ({ name, desc }) => {
  cy.visit(`/questions/create/other`)

  cy.contains('Text').click()

  cy.get('[data-test-id="text-question-form"]')
    .within(() => {
      cy.get('input[name="name.en"]').type(name)

      if (desc) {
        cy.get('[data-test-id="html-input-field"]').click().type(desc)
      }

      cy.contains('Create question').click()
    })

    cy.get('[data-test-id="alert-success"]').should('contain', 'Question created');
}

const createEvaluationQuestion = (domain = 'motivation', { name }) => {
  cy.visit(`/questions/create/evaluation/?subtype=${domain}`)

  cy.get('form[data-test-id="evaluation-question-form"]')
    .within(() => {
      cy.get('input[name="name.en"]').first().type(name || 'What motivates you?')
    })

  cy.get('button[type="submit"]').should('contain', 'Add question').click()

  cy.get('[data-test-id="alert-success"]').should('contain', 'Question created')
}

const createEvaluationCriteriaQuestion = (domain = 'competency', details) => {
  const { name, note, criteria } = details;

  cy.visit(`/questions/create/evaluation/?subtype=${domain}`)

  cy.get('form[data-test-id="evaluation-question-form"]')
    .within(() => {
      cy.get('input[name="name.en"]').first().type(name || 'Are you good at maths?')

      if (note) {
        cy.get('[data-test-id="html-input-field"]#note').type(note)
      }
    })

  if (typeof criteria.create === 'undefined' || criteria.create) {
    cy.get('[data-test-id="criteria-option"]').as('criteria')
      .within(() => {
        cy.get('button').should('contain', 'Create new').click({ force: true})
      })

    cy.document().its('body')
      .find(`#criteria-option-modal`)
      .within(() => {
        cy.get('input[name="name.en"]').type(criteria.name || 'Math')
        cy.get('button[type="submit"]').click()
      })
      .wait(1000);
  } else {
    cy.get('[data-test-id="criteria-option"]')
      .within(() => {
        cy.get('input')
          .type(`${criteria.name}`)
          .wait(1000)
          .type(`{enter}`)
      })
  }

  cy.get('button[type="submit"]').should('contain', 'Add question').click()

  cy.get('[data-test-id="alert-success"]').should('contain', 'Question created')
}

const createChoiceQuestion = (domain = 'screening', details) => {
  const { name, desc, choices = ['Yes', 'No'], multichoice } = details;

  cy.visit(`/questions/create/${domain}`)

  cy.contains('Yes/No').click()

  cy.get(`[data-test-id="${domain}-question-form"]`)
    .within(() => {
      cy.get('input[name="name.en"]').first().type(name)

      if (desc) {
        cy.get('[data-test-id="html-input-field"]').click().type(desc)
      }

      for (let i = 0; i < choices.length; i++) {
        if (i > 1) {
          cy.contains('Add answer').click()
        }

        cy.get(`input[name="answers[${i}].name.en"]`).type(choices[i])
      }

      if (multichoice) {
        cy.get('input[type="checkbox"]').click()
      }

      cy.contains('Create question').click()
    })

    cy.get('[data-test-id="alert-success"]').should('contain', 'Question created');
}

const createRangeQuestion = (domain = 'screening', details) => {
  const { name, desc, min, max, unit, step } = details;

  cy.visit(`/questions/create/${domain}`)

  cy.contains('Range').click()

  cy.get(`[data-test-id="${domain}-question-form"]`)
    .within(() => {
      cy.get('input[name="name.en"]').type(name)


      if (desc) {
        cy.get('[data-test-id="html-input-field"]').click().type(desc)
      }

      cy.get('input[name="min"]').type(min || 0)
      cy.get('input[name="max"]').type(max || (min * 10) || 0)
      cy.get('input[name="unit"]').type(unit || 'X')
      cy.get('input[name="step"]').type(`{selectAll}{backspace}${step || 1}`)

      cy.contains('Create question').click()
    })

    cy.get('[data-test-id="alert-success"]').should('contain', 'Question created');
}

Cypress.Commands.add('createEvaluationQuestion', createEvaluationQuestion)


Cypress.Commands.add(
  'createEvaluationCriteriaQuestion',
  (type, details, createCriteria = true) => {
    createEvaluationCriteriaQuestion(type, { ...details, criteria: { name: details.criteria }, create: createCriteria })
  })


Cypress.Commands.add('createCompetencyQuestion', (options) => createEvaluationCriteriaQuestion('competency', options))
Cypress.Commands.add('createHardSkillQuestion', (options) => createEvaluationCriteriaQuestion('hard-skill', options))
Cypress.Commands.add('createExperienceQuestion', (options) => createEvaluationCriteriaQuestion('experience', options))
Cypress.Commands.add('createCultureQuestion', (options) => createEvaluationQuestion('culture', options))
Cypress.Commands.add('createMotivationQuestion', (options) => createEvaluationQuestion('motivation', options))
Cypress.Commands.add('createScreeningChoiceQuestion', (options) => createChoiceQuestion('screening', options))
Cypress.Commands.add('createScreeningRangeQuestion', (options) => createRangeQuestion('screening', options))
Cypress.Commands.add('createOtherTextQuestion', createTextQuestion)
