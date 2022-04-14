describe('Questions', () => {
  beforeEach(() => {
    cy.login('joe.doe@example.com', 'test123')
  })

  it('listing page shuld have questions table and filtering', () => {
    cy.visit('/questions/')

    cy.title().should('include', 'Questions listing')

    //@TODO: filtering

    cy.get('table thead tr')
      .first()
      .within(() => {
        cy.get('th').eq(0).should('contain', 'Type of question')
        cy.get('th').eq(1).should('contain', 'Criterion')
        cy.get('th').eq(2).should('contain', 'Question')
        cy.get('th').eq(3).should('contain', 'Follow up questions')
      })

    //@TODO: data
  })
})
