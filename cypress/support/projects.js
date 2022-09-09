Cypress.Commands.add('createDummyProject', (name = 'Demo ABC', template = '') => {
  if (template) {
    cy.visit('/templates/')
    cy.get('input[name="q"]').type(template)

    cy.contains(template)
      .closest('li')
      .listRowNavigate('Create project')
      .wait(1000)
  } else {
    cy.visit('/projects/create/')
  }

  cy.get('input[name="name"]').type(name)

  cy.contains('Select interviewer')
    .closest('[data-test-id="interviewer-select"]')
    .click()
    .wait(1000)
    .trigger('keyup', { code: "Enter" })
    .type('{downArrow}{enter}')

  cy.get('[data-test-id="feature-form"]')
  .within(() => {
    cy.get('[contenteditable="true"]')
      .click()
      .wait(500)
      .type('{selectAll}{backspace}Lorem ipsum dolor sit amet')
  })

  cy.get('button').contains('Create project').click()

  cy.get('[data-test-id="alert-success"]').should('contain', 'Project created')
})

Cypress.Commands.add('createEmptyProject', (name = 'Demo ABC') => {
  cy.visit('/projects/create/')
  
  cy.get('input[name="name"]').type(name)

  cy.contains('Select interviewer')
    .closest('[data-test-id="interviewer-select"]')
    .click()
    .wait(1000)
    .trigger('keyup', { code: "Enter" })
    .type('{downArrow}{enter}')

  cy.get('[data-test-id="stage-tree-leaf"]')
    .should('contain', 'Introduction')
    .within(() => {
      cy.get('button').click()
      cy.contains('Delete').click()
    })

  cy.get('button').contains('Create project').click()

  cy.get('[data-test-id="alert-success"]').should('contain', 'Project created')
})

Cypress.Commands.add('addProjectCandidate', (name, email) => {
  cy.contains('Add candidate')
    .click()

  cy.get('[data-test-id="candidate-form"]').within(() => {
    cy.get('input[name="name"]').type(name)
    cy.get('input[name="email"]').type(email)
    cy.get('button[type="submit"]').click()
  })
})

Cypress.Commands.add('addStage', (name, minutes) => {
  cy.contains('Add interview stage')
    .click()

  cy.get('[data-test-id="project-process"]')
    .contains(name)
    .click()

  if (typeof minutes !== "undefined") {
    cy.get('[data-test-id="minutes-input"]')
      .click()
      .type(`{selectAll}{backspace}${minutes}{enter}`)
  }
})

Cypress.Commands.add('focusStage', (name) => {
  cy.get('[data-test-id="project-process"]')
    .contains(name)
    .click()
})

Cypress.Commands.add(
  'confirmStageOrder',
  {  prevSubject: true },
  (subject, list = []) => {
    cy.wrap(subject)
      .within(() => {
        for (let i = 0; i < list.length; i++) {
          cy.get('[data-test-id="stage"]').eq(i)
            .should('contain', list[i])
        }
      })
})