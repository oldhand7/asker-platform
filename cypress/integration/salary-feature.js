describe('Salary feature', () => {
  beforeEach(() => {
    cy.login('joe.smith@example.com', 'test123', 'salary-feature')
  })

  it('should create a project with salary feature and allow selection of min/max salary values during interview', () => {
    cy.createDummyProject('Sales manager')

    cy.get('table tbody tr')
      .first()
      .find('td').last()
      .find('button').click().parent()
      .contains('Edit').click()

    cy.get('[data-test-id="feature-salary"]').drag('[data-test-id="stage-2"] .Droppable')

    cy.get('[data-test-id="stage-2"]')
      .contains('Salary')
      .click()

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

    cy.get('table tbody tr')
      .first()
      .find('td').eq(3)

      .find('[data-test-id="stage"]').eq(1)
      .should('contain', 'Salary')
      .should('contain', '2')

    cy.get('table tbody tr')
      .first()
      .find('td').last()
      .find('button').click().parent()
      .contains('Interviews').click()

    cy.addProjectCandidate('Alice', 'alice@bobshouse.com')
      .wait(2000)

    cy.get('table tbody tr')
      .first()
      .contains('Start interview')
      .click()

    cy.get('[data-test-id="feature-form"]')
      .eq(1)
      .within(() => {
        cy.get('h2').should('contain', 'Salary')

        cy.get('[role="slider"]').eq(0)
          .should('have.attr', 'aria-valuemin', '1000')
          .should('have.attr', 'aria-valuenow', '1000')
          .should('contain', '$1000')

        cy.get('[role="slider"]').eq(1)
          .should('have.attr', 'aria-valuemax', '3000')
          .should('have.attr', 'aria-valuenow', '3000')
          .should('contain', '$3000')
      })
      .should('contain', '$1000 -')
      .should('contain', '- $3000')
  })
})
