describe('Pagination', () => {
  beforeEach(() => {
    cy.login('joe.brown@example.com', 'test123', 'pagination')
  })

  it('should paginate projects', () => {
    cy.visit('/projects/')

    cy.createDummyProject('Demo Project 1')
    cy.createDummyProject('Demo Project 2')
    cy.createDummyProject('Demo Project 3')
    cy.createDummyProject('Demo Project 4')
    cy.createDummyProject('Demo Project 5')

    cy.get('table tbody tr')
      .should('have.length', 5)

    //Only arrows
    cy.get('[data-test-id="pagination"] ul li').should('have.length', 5)

    cy.visit('/projects/?perPage=4')

    cy.get('table tbody tr')
      .should('have.length', 4)
      .parent()
      .should('not.contain', 'Demo Project 1')

    cy.get('[data-test-id="pagination"] ul li')
      .should('have.length', 6)
      .parent()
      .contains('2')
      .click()

    cy.get('table tbody tr')
      .should('have.length', 1)
      .last()
      .should('contain', 'Demo Project 1')

    cy.visit('/projects/?perPage=2&page=2')

    cy.get('table tbody tr')
      .should('have.length', 2)
      .parent()
      .should('contain', 'Demo Project 3')
      .should('contain', 'Demo Project 2')
      .should('not.contain', 'Demo Project 5')
      .should('not.contain', 'Demo Project 4')
      .should('not.contain', 'Demo Project 1')

    cy.get('[data-test-id="pagination"] ul li')
      .should('have.length', 7)
      .eq(1)
      .click()

      cy.get('table tbody tr')
        .should('have.length', 2)
        .parent()
        .should('contain', 'Demo Project 5')
        .should('contain', 'Demo Project 4')
        .should('not.contain', 'Demo Project 3')
        .should('not.contain', 'Demo Project 2')
        .should('not.contain', 'Demo Project 1')

    cy.get('[data-test-id="pagination"] ul li')
      .last()
      .click()

    cy.get('table tbody tr')
      .should('have.length', 1)
      .last()
      .should('contain', 'Demo Project 1')
  })

  it('should paginate templates', () => {
    cy.visit('/templates/')

    cy.createDummyTemplate('Demo Template 1')
    cy.createDummyTemplate('Demo Template 2')
    cy.createDummyTemplate('Demo Template 3')
    cy.createDummyTemplate('Demo Template 4')
    cy.createDummyTemplate('Demo Template 5')

    cy.get('table tbody tr')
      .should('have.length', 5)

    //Only arrows
    cy.get('[data-test-id="pagination"] ul li').should('have.length', 5)

    cy.visit('/templates/?perPage=4')

    cy.get('table tbody tr')
      .should('have.length', 4)
      .parent()
      .should('not.contain', 'Demo Template 1')

    cy.get('[data-test-id="pagination"] ul li')
      .should('have.length', 6)
      .parent()
      .contains('2')
      .click()

    cy.get('table tbody tr')
      .should('have.length', 1)
      .last()
      .should('contain', 'Demo Template 1')

    cy.visit('/templates/?perPage=2&page=2')

    cy.get('table tbody tr')
      .should('have.length', 2)
      .parent()
      .should('contain', 'Demo Template 3')
      .should('contain', 'Demo Template 2')
      .should('not.contain', 'Demo Template 5')
      .should('not.contain', 'Demo Template 4')
      .should('not.contain', 'Demo Template 1')

    cy.get('[data-test-id="pagination"] ul li')
      .should('have.length', 7)
      .eq(1)
      .click()

      cy.get('table tbody tr')
        .should('have.length', 2)
        .parent()
        .should('contain', 'Demo Template 5')
        .should('contain', 'Demo Template 4')
        .should('not.contain', 'Demo Template 3')
        .should('not.contain', 'Demo Template 2')
        .should('not.contain', 'Demo Template 1')

    cy.get('[data-test-id="pagination"] ul li')
      .last()
      .click()

    cy.get('table tbody tr')
      .should('have.length', 1)
      .last()
      .should('contain', 'Demo Template 1')
  })

  it('should paginate questions', () => {
    cy.visit('/questions/')

    cy.createTextQuestion('Demo Question 1')
    cy.createTextQuestion('Demo Question 2')
    cy.createTextQuestion('Demo Question 3')
    cy.createTextQuestion('Demo Question 4')
    cy.createTextQuestion('Demo Question 5')

    cy.get('table tbody tr')
      .should('have.length', 5)

    //Only arrows
    cy.get('[data-test-id="pagination"] ul li').should('have.length', 5)

    cy.visit('/questions/?perPage=4')

    cy.get('table tbody tr')
      .should('have.length', 4)
      .parent()
      .should('not.contain', 'Demo Question 1')

    cy.get('[data-test-id="pagination"] ul li')
      .should('have.length', 6)
      .parent()
      .contains('2')
      .click()

    cy.get('table tbody tr')
      .should('have.length', 1)
      .last()
      .should('contain', 'Demo Question 1')

    cy.visit('/questions/?perPage=2&page=2')

    cy.get('table tbody tr')
      .should('have.length', 2)
      .parent()
      .should('contain', 'Demo Question 3')
      .should('contain', 'Demo Question 2')
      .should('not.contain', 'Demo Question 5')
      .should('not.contain', 'Demo Question 4')
      .should('not.contain', 'Demo Question 1')

    cy.get('[data-test-id="pagination"] ul li')
      .should('have.length', 7)
      .eq(1)
      .click()

      cy.get('table tbody tr')
        .should('have.length', 2)
        .parent()
        .should('contain', 'Demo Question 5')
        .should('contain', 'Demo Question 4')
        .should('not.contain', 'Demo Question 3')
        .should('not.contain', 'Demo Question 2')
        .should('not.contain', 'Demo Question 1')

    cy.get('[data-test-id="pagination"] ul li')
      .last()
      .click()

    cy.get('table tbody tr')
      .should('have.length', 1)
      .last()
      .should('contain', 'Demo Question 1')
  })
})
