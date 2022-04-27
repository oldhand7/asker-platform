describe('Projects', () => {
  beforeEach(() => {
    cy.login('joe.doe@example.com', 'test123', 'projects')
  })

  it('should show a no projects message', () => {
    cy.visit('/projects/')
    cy.title().should('include', 'Projects')
    cy.contains('No projects to show.')

    cy.get('table thead tr')
      .first()
      .within(() => {
        cy.get('th').eq(0).should('contain', 'Project name')
        cy.get('th').eq(1).should('contain', 'Template name')
        cy.get('th').eq(2).should('contain', 'Interviewer name')
        cy.get('th').eq(3).should('contain', 'Interview stages')
        cy.get('th').eq(4).should('contain', 'Interview status')
      })
  })

  it('should create a 1 step project with introduction', () => {
    cy.visit('/projects/')

    cy.contains('Create new project')
      .click()
      .parent()
      .contains('Blank project')
      .click();

    cy.location('pathname').should('eq', '/projects/create/')
    cy.title().should('include', 'Create project')

    cy.get('form[data-test-id="project-form"]').within(() => {
      cy.contains('Create a new project')

      cy.get('input[name="name"]').type('Demo ABC')

      cy.get('ul[data-test-id="stager"]').children('li').should('have.length', 3)

      cy.get('[data-test-id="stage-1"]').contains('Introduction')
      cy.get('[data-test-id="stage-2"]').contains('Drag and drop here to add a section')
      cy.get('[data-test-id="stage-3"]').contains('Drag and drop here to add a section')

      //Custom drag-and-drop for react-beautiful-dnd FOCUS+SPACE+ARROW
      //Keys: 32 = space, 40 = arrow down
      cy.get('[data-test-id="stage-1"]')
        .as('handle')
        .scrollIntoView()
        .focus()
        .trigger('keydown', { keyCode: 32 })
        .get('@handle')
        .trigger('keydown', { keyCode: 40, force: true })
        .wait(100)
        .trigger('keydown', { keyCode: 32, force: true });


      cy.get('[data-test-id="stage-1"]').contains('Drag and drop here to add a section')
      cy.get('[data-test-id="stage-2"]').contains('Introduction').click()
      cy.get('[data-test-id="stage-3"]').contains('Drag and drop here to add a section')

      cy.get('[data-test-id="feature-form"]').find('textarea').type('Hello world')

      cy.get('[data-test-id="interviewers"]').find('input').type('Jane{enter}')
      cy.get('[data-test-id="interviewers"]').find('input').type('Joe{enter}')


      cy.get('ul[data-test-id="interviewers-list"]')
      .children('li').should('have.length', 2)
      .within(() => {
        cy.contains('Jane Doe')
        cy.contains('Joe Doe')
      })

      cy.get('button').contains('Create project').click()
    })

    cy.location('pathname').should('eq', '/projects/')
    cy.contains('Project created')

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Demo ABC')
        // cy.get('td').eq(1).should('contain', '-')
        cy.get('td').eq(2).should('contain', 'Jane Doe').should('contain', 'Joe Doe')
        cy.get('td').eq(3).should('contain', 'Introduction')
        cy.get('td').eq(4)
          .should('contain', '0 Number of candidates')
          .should('contain', '0 Awaiting')
          .should('contain', '0 Completed')
      })
  })
})
