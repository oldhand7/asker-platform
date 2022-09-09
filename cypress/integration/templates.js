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

  it('should create a 3 step template', () => {
    cy.visit('/templates/')

    cy.title().should('include', 'Templates')

    cy.contains('Create new template')
      .click()

    cy.location('pathname').should('eq', '/templates/create/')

    cy.title().should('include', 'Create template')

    cy.get('input[name="name"]').type('Demo TPL')

    cy.get('[data-test-id="feature-form"]')
      .findHtmlInputAndType('Lorem ipsum')

    cy.addStage('Salary')
    cy.addStage('Summary')
    
    cy.get('[data-test-id="feature-form"]')
      .findHtmlInputAndType('Lorem ipsum')

    cy.contains('Create template').click()

    cy.location('pathname').should('eq', '/templates/')
    
    cy.contains('Template created')

    cy.contains('Demo TPL')
      .closest('li')
      .should('contain', dateFormatedToday())
      .should('contain', 'Joe')
      .should('contain', '15m')
      .confirmStageOrder([
        'Introduction',
        'Salary',
        'Summary'
      ])
  })

  it('shoud create project from template', () => {
    cy.createOtherTextQuestion({ name: 'Sample questione' })

    cy.createDummyTemplate('Tmpl Test')

    cy.visit('/projects/')

    cy.contains('Create new project').click()
    cy.contains('Use template').click()

    cy.get('#project-template-modal')
      .within(() => {
        cy.contains('Tmpl Test').closest('tr').find('button').click()
      })
    
    cy.location('pathname').should('contain', '/projects/create/')
    cy.location('search').should('contain', '?template=')

    cy.get('[data-test-id="project-form"]')
      .should('contain', 'Template: Tmpl Test')

    cy.contains('Select interviewer')
      .closest('[data-test-id="interviewer-select"]')
      .click()
      .wait(1000)
      .trigger('keyup', { code: "Enter" })
      .type('{downArrow}{enter}')
  
    cy.get("input[name='name']").type('Testing')

    cy.contains('Create project').click()

    cy.get('[data-test-id="alert-success"]').should('contain', 'Project created');
  })
})
