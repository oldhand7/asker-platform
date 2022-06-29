describe('Table sort', () => {
  beforeEach(() => {
    cy.login('joe.anderson@example.com', 'test123')
  })

  it('should sort projects by name', () => {
    cy.visit('/projects/')

    cy.createDummyProject('BBB')
    cy.createDummyProject('AAA')
    cy.createDummyProject('CCC')

    cy.get('[data-test-id="project-list"] > li')
      .first()
      .should('contain', 'CCC')
      .next()
      .should('contain', 'AAA')
      .next()
      .should('contain', 'BBB')
  })

  it('should sort templates by name', () => {
    cy.visit('/templates/')

    cy.createDummyTemplate('BBB')
    cy.createDummyTemplate('AAA')
    cy.createDummyTemplate('CCC')

    cy.get('table tbody tr')
      .should('have.length', 3)
      .parent()
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'CCC')
        cy.get('tr').eq(1).should('contain', 'AAA')
        cy.get('tr').eq(2).should('contain', 'BBB')
      })

    cy.get('table thead tr th').first().find('a').click().wait(1000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'AAA')
        cy.get('tr').eq(1).should('contain', 'BBB')
        cy.get('tr').eq(2).should('contain', 'CCC')
      })

    cy.get('table thead tr th').first().find('a').click().wait(1000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'CCC')
        cy.get('tr').eq(1).should('contain', 'BBB')
        cy.get('tr').eq(2).should('contain', 'AAA')
      })

    cy.get('table thead tr th').eq(2).find('a').click().wait(1000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'BBB')
        cy.get('tr').eq(1).should('contain', 'AAA')
        cy.get('tr').eq(2).should('contain', 'CCC')
      })

    cy.get('table thead tr th').eq(2).find('a').click().wait(1000)

    cy.get('table tbody')
      .within(() => {
        cy.get('tr').eq(0).should('contain', 'CCC')
        cy.get('tr').eq(1).should('contain', 'AAA')
        cy.get('tr').eq(2).should('contain', 'BBB')
      })
  })

  it('should sort questions by name', () => {
    cy.visit('/questions/')

    cy.createTextQuestion('BBB')
    cy.createTextQuestion('AAA')
    cy.createTextQuestion('CCC')

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
