describe('User RA', () => {
  beforeEach(() => {
    cy.login('admin@askertech.com', 'test123')
  })

  it('superadmin creates user', () => {
      cy.visit('/admin/')

      cy.hash().should('eq', '#/pages')

      cy.visit('/admin/#/companies/create')
      cy.get('input[id="name"]').type('Dakota Holding{enter}')

      cy.get('table')
        .should('contain', 'Dakota Holding')
        .should('contain', 'Doe Paper Company')
        .should('contain', 'Philips')

      cy.visit('/admin/#/users/create')

      cy.get('input[id="name"]').type('F. Dakota')
      cy.get('input[id="email"]').type('f.dakota@hotmail.net')
      cy.get('input[id="phone"]').type('+37067778889')
      cy.get('#companyId').click()
      cy.contains('Dakota Holding').click()
      cy.get('input#password').type('test456')
      cy.get('button[type="submit"]').click().wait(4000)

      cy.hash().should('eq', '#/users')

      cy.get('table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(2).should('contain', 'F. Dakota')
          cy.get('td').eq(3).should('contain', 'f.dakota@hotmail.net')
          cy.get('td').eq(4).should('contain', 'Dakota Holding')
          cy.get('td').eq(5).should('contain', 'Admin')
        })

      cy.visit('/logout/')
      cy.location('pathname').should('eq', '/login/')

      cy.simpleLogin('f.dakota@hotmail.net', 'test456')

      cy.get('[data-test-id="user-card"]').contains('F. Dakota')
  })
})
