describe('Company employees', () => {
  beforeEach(() => {
      cy.login('joe.miller@example.com', 'test123')
  })

  it('can list, add, edit and delete HR employees', () => {
    cy.visit('/profile/')
    cy.get('[data-test-id="company-employees-form"]').should('not.exist')
    cy.contains('Employees').click()
    cy.get('[data-test-id="company-employees-form"] iframe')
      .should('be.visible')
      .should('have.attr', 'src').and('contain', '/admin/profile/#/users?filter=')
      .then(src => {
        cy.visit(src)

        cy.contains('Rows per page').should('exist')

        cy.get('table thead tr')
          .first()
          .within(() => {
            cy.get('th').eq(1).should('contain', 'Name')
            cy.get('th').eq(2).should('contain', 'Email')
            cy.get('th').eq(3).should('contain', 'Phone')
            cy.get('th').eq(4).should('contain', 'Type')
          })

        cy.get('table tbody')
          .contains('Jane Miller')
          .closest('tr')
          .within(() => {
            cy.get('td').eq(1).should('contain', 'Jane Miller')
            cy.get('td').eq(2).should('contain', 'jane.miller@example.com')
            cy.get('td').eq(4).should('contain', 'HR')
          })

        cy.get('table tbody')
          .contains('Joe Miller')
          .closest('tr')
          .within(() => {
            cy.get('td').eq(1).should('contain', 'Joe Miller')
            cy.get('td').eq(2).should('contain', 'joe.miller@example.com')
            cy.get('td').eq(4).should('contain', 'Admin')
          })

        cy.contains('Create').click()

        cy.get('input[name="name"]').type('Bob Miller')
        cy.get('input[name="email"]').type('bob.miller@example.com')
        cy.get('input[name="phone"]').type('+37061112223')
        cy.get('input[name="password"]').type('bob123')

        cy.contains('Save').click()

        cy.contains('Rows per page').should('exist')

        cy.get('table tbody tr')
          .first()
          .within(() => {
            cy.get('td').eq(1).should('contain', 'Bob Miller')
            cy.get('td').eq(2).should('contain', 'bob.miller@example.com')
            cy.get('td').eq(3).should('contain', '+37061112223')
            cy.get('td').eq(4).should('contain', 'HR')
          })

        cy.contains('Jane Miller').click()
        cy.contains('Delete').click()
        cy.get('[role="dialog"]')
          .should('contain', 'Delete user Jane Miller')
          .within(() => {
            cy.contains('Confirm').click()
          })
          .wait(4000)

        cy.logout()

        cy.simpleLogin('bob.miller@example.com', 'bob123', true)

        cy.logout()
          .wait(2000)

        cy.simpleLogin('jane.miller@example.com', 'test123')

        cy.get('[data-test-id="alert-danger"]').contains('Email or password invalid')

        cy.task('getLastEmail', 'bob.miller@example.com')
          .its('html')
          .then((html) => {
            cy.document().invoke('write', html)
            cy.contains('credentials', { matchCase : false})
            cy.contains('bob.miller@example.com')
            cy.contains('bob123')
          })
      })
  })
})
