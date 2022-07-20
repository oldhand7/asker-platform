const dateFormatedToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.toLocaleString('en-us',{ month:'short' })
  const day = `0${date.getDate()}`.slice(-2)

  return `${day} ${month} ${year}`
}

describe('Templates', () => {
  beforeEach(() => {
    cy.login('joe.doe@example.com', 'test123', 'templates')
  })

  it('should show a no templates message', () => {
    cy.visit('/templates/')
    cy.title().should('include', 'Templates')
    cy.contains('No templates to show.')
  })

  it('should create a 1 step template with introduction', () => {
    cy.visit('/templates/')

    cy.contains('Create new template')
      .click()

    cy.location('pathname').should('eq', '/templates/create/')
    cy.title().should('include', 'Create template')

    cy.get('form[data-test-id="template-form"]').within(() => {

      cy.get('input[name="templateName"]').type('Demo TPL')

      cy.get('ul[data-test-id="stager"]').children('li').should('have.length', 3)

      cy.get('[data-test-id="stage-1"]').contains('Introduction').click()
      cy.get('[data-test-id="stage-2"]').contains('Drag and drop here to add a section')
      cy.get('[data-test-id="stage-3"]').contains('Drag and drop here to add a section')
      cy.get('[data-test-id="feature-salary"]').drag('[data-test-id="stage-2"] .Droppable')
      cy.get('[data-test-id="feature-summary"]').drag('[data-test-id="stage-3"] .Droppable')
      cy.get('[data-test-id="stage-2"]').contains('Salary')
      cy.get('[data-test-id="stage-3"]').contains('Summary')

      cy.get('[data-test-id="feature-form"]').find('[data-test-id="html-input-field"]').type('Demo TPL hello')

      cy.get('button').contains('Create template').click()
    })

    cy.location('pathname').should('eq', '/templates/')
    cy.contains('Template created')

    cy.contains('Demo TPL')
      .closest('li')
      .should('contain', 'Joe')
      .should('contain', '15 min')
      .within(() => {
          cy.get('[data-test-id="stage"]').eq(0).should('contain', 'Introduction')
          cy.get('[data-test-id="stage"]').eq(1).should('contain', 'Salary')
          cy.get('[data-test-id="stage"]').eq(2).should('contain', 'Summary')
      })
  })

  it('shoud create project from template', () => {
    cy.createTextQuestion('Sample questione')

    cy.createDummyTemplate('Tmpl Test')

    cy.contains('Tmpl Test')
      .closest('ul')
      .listFirstRowNavigate('Edit')

    cy.contains('Add stage')
      .click()

    cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-2"] .Droppable')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('input[name="q"]').type('Sample questione')
        cy.get('button[data-test-id="add-question"]').first().click()
      })

    cy.contains('Save template').click()

    cy.get('[data-test-id="alert-success"]').should('contain', 'Template saved');

    cy.contains('Tmpl Test')
      .closest('ul')
      .listFirstRowNavigate('Edit')

    cy.get('[data-test-id="stage-2"]').click()

    cy.get('[data-test-id="feature-form"] [data-test-id="question-manager"]')
      .should('contain', 'Sample questione')
  })
})
