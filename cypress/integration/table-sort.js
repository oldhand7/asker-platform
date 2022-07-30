describe('Table sort', () => {
  beforeEach(() => {
    cy.login('joe.anderson@example.com', 'test123')
  })

  it('should sort questions by name', () => {
    cy.visit('/questions/')

    cy.createOtherTextQuestion({ name: 'BBB' })
    cy.createOtherTextQuestion({ name: 'AAA' })
    cy.createOtherTextQuestion({ name: 'CCC' })

    cy.get('table tbody tr')
      .should('have.length', 3)
      .parent()
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'CCC')
        cy.get('tr').eq(1).should('contain', 'AAA')
        cy.get('tr').eq(2).should('contain', 'BBB')
      })

    cy.get('table thead tr th').eq(2).find('a').click().wait(1000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'AAA')
        cy.get('tr').eq(1).should('contain', 'BBB')
        cy.get('tr').eq(2).should('contain', 'CCC')
      })

    cy.get('table thead tr th').eq(2).find('a').click().wait(1000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'CCC')
        cy.get('tr').eq(1).should('contain', 'BBB')
        cy.get('tr').eq(2).should('contain', 'AAA')
      })

    cy.get('table thead tr th').last().find('a').click().wait(1000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'CCC')
        cy.get('tr').eq(1).should('contain', 'AAA')
        cy.get('tr').eq(2).should('contain', 'BBB')
      })
  })
})
