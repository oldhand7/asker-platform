describe('Project overview', () => {
  beforeEach(() => {
    cy.login('joe.philips@example.com', 'test123')
  })

  it('cliking on project list project redirects to verview page', () => {
    cy.visit('/projects/')

    cy.get('table tbody tr')
      .last() //created first should be last
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Philips Demo Project')
        cy.get('td').eq(1).should('contain', 'Philips Engineer')
        cy.get('td').eq(2).should('contain', 'Jane Philips').should('not.contain', 'Joe Philips')
        cy.get('td').eq(3).should('contain', 'Introduction').should('contain', 'Questions').should('contain', 'Summary')
        cy.get('td').eq(4)
          .should('contain', '2 Number of candidates')
          .should('contain', '1 Awaiting')
          .should('contain', '1 Completed')
      })
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

    cy.get('table tbody tr')
      .last()
      .click()

    cy.get('h1').should('contain', 'Philips Demo Project')

    cy.get('[data-test-id="interviewers"]')
      .should('contain', 'Jane Philips')
      .should('not.contain', 'Joe Philips')

    cy.get('table thead tr')
      .first()
      .within(() => {
        cy.get('th').eq(0).should('contain', 'Name')
        cy.get('th').eq(1).should('contain', 'Total interview score')
        cy.get('th').eq(2).should('contain', 'Evaluations scores')
      })

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').should('have.length', 2)

        cy.get('tr')
          .eq(1)
          .within(() => {
            cy.get('td').eq(0).should('contain', 'Candidate A')
            cy.get('td').eq(1).should('contain', '40%')
            cy.get('td').eq(2).should('not.contain', 'Start interview')
          })

        cy.get('tr')
          .eq(0)
          .within(() => {
            cy.get('td').eq(0).should('contain', 'Candidate B')
            cy.get('td').eq(1).should('not.contain', '%')
            cy.get('td').eq(2).should('contain', 'Start interview')
          })
      })

    //@TODO: evaluation criteria
  })

  it('project overview allows adding new candidates', () => {
    cy.visit('/projects/')

    cy.get('table tbody tr')
      .last()
      .click()

    cy.contains('Add candidate')
      .click()

    cy.get('[data-test-id="candidate-form"]').within(() => {
      cy.get('input[name="name"]').type("Dread Roberts")
      cy.get('input[name="email"]').type("dread.roberts@gmail.com")
      cy.get('button[type="submit"]').click()
    })
    .wait(2000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').should('have.length', 3)

        cy.get('tr')
          .eq(0)
          .within(() => {
            cy.get('td').eq(0).should('contain', 'Dread Roberts')
            cy.get('td').eq(1).should('not.contain', '%')
            cy.get('td').eq(2).should('contain', 'Start interview')
          })
      })

    cy.wait(1000)

    cy.visit('/projects/')

    cy.get('table tbody tr')
      .last()
      .within(() => {
        cy.get('td').eq(4)
          .should('contain', '3 Number of candidates')
          .should('contain', '2 Awaiting')
          .should('contain', '1 Completed')
      })

  })
})
