describe('Project overview', () => {
  beforeEach(() => {
    cy.login('joe.philips@example.com', 'test123', 'project-overview')
  })

  it('cliking on project list project redirects to overview page', () => {
    cy.visit('/projects/')

    cy.wait(1000)

    cy.get('[data-test-id="project-list"] > li')
      .last()
      .should('contain', 'Philips Demo Project')
      .should('contain', 'Philips Engineer')
      .should('contain', 'Jane Philips')
      .should('contain', '15 min')
      .should('contain', '1 Awaiting')
      .should('contain', '1 Completed')
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
  })

  it('project overview page contains project details and interview statistics', () => {
    cy.visit('/projects/')

    cy.get('[data-test-id="project-list"] li')
      .last()
      .click()

    cy.get('h1').should('contain', 'Philips Demo Project')

    cy.get('[data-test-id="interviewers"]')
      .should('contain', 'Jane Philips')
      .should('not.contain', 'Joe Philips')

    cy.get('[data-test-id="flex-table-head"]')
      .within(() => {
        cy.get('div').eq(0).should('contain', 'Candidate')
        cy.get('div').eq(1).should('contain', 'Total interview score')
        cy.get('div').eq(2).should('contain', 'Date of interview')
      })

    cy.get('[data-test-id="flex-table-body"]')
      .within(() => {
        cy.get('[data-test-id="flex-table-row"]').should('have.length', 2)

        cy.get('[data-test-id="flex-table-row"]')
          .eq(0)
          .within(() => {
            cy.get('[data-test-id="flex-table-column"]').eq(0).should('contain', 'Candidate A')
            cy.get('[data-test-id="flex-table-column"]').eq(1).should('contain', '40%')
            cy.get('[data-test-id="flex-table-column"]').eq(2).should('not.contain', 'Start interview')
          })

        cy.get('[data-test-id="flex-table-row"]')
          .eq(1)
          .within(() => {
            cy.get('[data-test-id="flex-table-column"]').eq(0).should('contain', 'Candidate B')
            cy.get('[data-test-id="flex-table-column"]').eq(2).should('contain', 'Start interview')
          })
      })
  })

  it('project overview allows adding new candidates', () => {
    cy.visit('/projects/')

    cy.get('[data-test-id="project-list"] li')
      .last()
      .click()

    cy.addProjectCandidate('Dread Roberts', 'dread.roberts@gmail.com')
      .wait(1000)

    cy.get('[data-test-id="flex-table"]')
      .within(() => {
        cy.get('[data-test-id="flex-table-row"]').should('have.length', 3)

        cy.get('[data-test-id="flex-table-row"]')
          .eq(0)
          .within(() => {
            cy.get('[data-test-id="flex-table-column"]').eq(0).should('contain', 'Dread Roberts')
            cy.get('[data-test-id="flex-table-column"]').eq(2).should('contain', 'Start interview')
          })
      })

    cy.wait(1000)

    cy.visit('/projects/')

    cy.get('[data-test-id="project-list"] > li')
      .last()
      .should('contain', '2 Awaiting')
      .should('contain', '1 Completed')
  })
})
