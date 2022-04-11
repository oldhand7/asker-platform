describe('Pages', () => {
  beforeEach(() => {
    cy.login('joe.doe@example.com', 'test123', 2000)
  })

  it('has Project List accessable', () => {
    cy.visit('/projects/')
    cy.title().should('include', 'Projects')
  })

  it('has Create Project accessable', () => {
    cy.visit('/projects/create/')
    cy.title().should('include', 'Create Project')
  })
})
