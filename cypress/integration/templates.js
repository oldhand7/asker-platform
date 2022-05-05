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

    cy.get('table thead tr')
      .first()
      .within(() => {
        cy.get('th').eq(0).should('contain', 'Template name')
        cy.get('th').eq(1).should('contain', 'Created by')
        cy.get('th').eq(2).should('contain', 'Date created')
        cy.get('th').eq(3).should('contain', 'Interview stages')
      })
  })

  it('should create a 1 step template with introduction', () => {
    cy.visit('/templates/')

    cy.contains('Create new template')
      .click()

    cy.location('pathname').should('eq', '/templates/create/')
    cy.title().should('include', 'Create template')

    cy.get('form[data-test-id="template-form"]').within(() => {
      cy.contains('Create a new template')

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

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Demo TPL')
        cy.get('td').eq(1).should('contain', 'Joe')
        cy.get('td').eq(2).should('contain', dateFormatedToday())
        cy.get('td').eq(3)
          .within(() => {
              cy.get('[data-test-id="stage"]').should('have.length', 3)
              cy.get('[data-test-id="stage"]').eq(0).should('contain', 'Introduction')
              cy.get('[data-test-id="stage"]').eq(1).should('contain', 'Salary')
              cy.get('[data-test-id="stage"]').eq(2).should('contain', 'Summary')
          })
      })
  })
})
