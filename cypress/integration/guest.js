describe('Guest', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false })
  })

  it('should be redirected to login page', () => {
    cy.location('pathname').should('eq', '/login/')
  })
})
