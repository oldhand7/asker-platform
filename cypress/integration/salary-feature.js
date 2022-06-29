describe('Salary feature', () => {
  beforeEach(() => {
    cy.login('joe.smith@example.com', 'test123', 'salary-feature')
  })

  it('should create a project with salary feature and allow selection of min/max salary values during interview', () => {
    cy.createDummyProject('Sales manager')

    cy.contains('Sales manager')
      .closest('ul')
      .listFirstRowNavigate('Edit')

    cy.contains('Add stage').click()

    cy.get('[data-test-id="feature-salary"]').drag('[data-test-id="stage-2"] .Droppable')

    cy.get('[data-test-id="stage-2"]')
      .contains('Salary')

    cy.get('[data-test-id="feature-form"]')
      .should('contain', 'Salary range')
      .within(() => {
        cy.get('[role="slider"]').eq(0)
          .should('have.attr', 'aria-valuemin', '0')
          .should('have.attr', 'aria-valuenow', '1000')
          .should('contain', '€1000')

        cy.get('[role="slider"]').eq(1)
          .should('have.attr', 'aria-valuemax', '9000')
          .should('have.attr', 'aria-valuenow', '3000')
          .should('contain', '€3000')

        cy.get('input[name="currency"]').type('{selectAll}{backspace}$')

        cy.get('[role="slider"]').eq(0)
          .should('contain', '$1000')

        cy.get('[role="slider"]').eq(1)
          .should('contain', '$3000')
      })

    cy.contains('Save project').click()

    cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')

    cy.contains('Sales manager').closest('li')
      .within(() => {
        cy.get('[data-test-id="stage"]')
          .should('have.length', 2)
          .eq(1)
          .should('contain', 'Salary')
          .should('contain', '2')
      }).click()

    cy.location('pathname').should('contain', '/overview/')
    

    cy.addProjectCandidate('Alice', 'alice@bobshouse.com')
      .wait(1000)

    cy.contains('Alice')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

    cy.get('[data-test-id="feature-form"]')
      .eq(1)
      .within(() => {
        cy.get('h2').should('contain', 'Salary')

        cy.get('[role="slider"]').eq(0)
          .should('have.attr', 'aria-valuemin', '0')
          .should('have.attr', 'aria-valuenow', '1000')
          .should('contain', '$1000')

        cy.get('[role="slider"]').eq(1)
          .should('have.attr', 'aria-valuemax', '9000')
          .should('have.attr', 'aria-valuenow', '3000')
          .should('contain', '$3000')
      })
      .should('contain', '$0 -')
      .should('contain', '- $9000')
  })
})
