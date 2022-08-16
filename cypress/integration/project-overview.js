describe('Project overview', () => {
  beforeEach(() => {
    cy.login('joe.philips@example.com', 'test123', 'project-overview')
  })

  it('cliking on project list project redirects to overview page', () => {
    cy.createDummyTemplate('Philips Engineer')

    cy.createDummyProject('Philips Demo Project', 'Philips Engineer')

    cy.createCompetencyQuestion({ name: 'Are you familiar with C1?', criteria: { name: 'C1', create: true }})

    cy.visit('/projects/')

    cy.get('[data-test-id="project-list"] li').first().listNavigate('Edit')

    cy.contains('Add stage').click()

    cy.get('[data-test-id="feature-competency-questions"]').drag('[data-test-id="stage-2"] .Droppable')
      .wait(1000)

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
          //Adding C1
          cy.get('button[data-test-id="add-question"]').first().click()
      })

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')

    cy.contains('Philips Demo Project').closest('li')
      .should('contain', 'Philips Demo Project')
      .should('contain', 'Philips Engineer')
      .should('contain', 'Jane Philips')
      .should('contain', '10 min')
      .should('contain', '0 Awaiting')
      .should('contain', '0 Completed')
      .click()

    cy.title().should('include', 'Philips Demo Project')
    cy.title().should('include', 'Project overview')

    cy.location().then(loc => {
      let match = Cypress.minimatch(loc.pathname , '/projects/*/overview/', {
        matchBase: true,
      })

      expect(match).to.be.true
    })

    cy.get('h1').should('contain', 'Philips Demo Project')

    cy.get('[data-test-id="interviewers"]')
      .should('contain', 'Jane Philips')
      .should('not.contain', 'Joe Philips')

    cy.get('[data-test-id="flex-table"]').within(() => {
      cy.get('[data-test-id="flex-table-head"]')
        .within(() => {
          cy.get('div').eq(0).should('contain', 'Candidate')
          cy.get('div').eq(1).should('contain', 'Total interview score')
          cy.get('div').eq(2).should('contain', 'Date of interview')
        })

      cy.get('[data-test-id="flex-table-body"]')
        .should('contain', 'No interviews');
    })

    cy.addProjectCandidate('Candidate A', 'candidate1@example.com')
    cy.addProjectCandidate('Candidate B', 'candidate2@example.com')
    cy.addProjectCandidate('Candidate C', 'candidate3@example.com')

    cy.wait(1000)

    cy.get('[data-test-id="flex-table-body"]')
      .within(() => {
          cy.get('[data-test-id="flex-table-row"]').eq(0)
            .should('contain', 'Candidate C')
            .should('contain', 'Start interview')

          cy.get('[data-test-id="flex-table-row"]').eq(1)
            .should('contain', 'Candidate B')
            .should('contain', 'Start interview')

          cy.get('[data-test-id="flex-table-row"]').eq(2)
            .should('contain', 'Candidate A')
            .should('contain', 'Start interview')
      })

    cy.visit('/projects/')

    cy.contains('Philips Demo Project').closest('li')
      .should('contain', '3 Awaiting')
      .should('contain', '0 Completed')
      .click()

      
    cy.contains('Candidate A').closest('[data-test-id="flex-table-row"]')
      .contains('Start interview').click()
    
    cy.contains('Great').click()

    cy.contains('Complete interview').click()

    cy.get('[data-test-id="flex-table-body"]')
      .within(() => {
          cy.get('[data-test-id="flex-table-row"]').eq(0)
            .should('contain', '75%')
            .should('contain', 'Candidate A')
            .should('not.contain', 'Start interview')

          cy.get('[data-test-id="flex-table-row"]').eq(1).should('contain', 'Candidate C')
          cy.get('[data-test-id="flex-table-row"]').eq(2).should('contain', 'Candidate B')
      })

    cy.visit('/projects/')

    cy.contains('Philips Demo Project').closest('li')
      .should('contain', '2 Awaiting')
      .should('contain', '1 Completed')
  })
})
