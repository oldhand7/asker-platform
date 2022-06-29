describe('Query filter', () => {
  beforeEach(() => {
    cy.login('joe.davis@example.com', 'test123', 'query-filter')
  })

  it('should filter projects', () => {
    cy.visit('/projects/')

    cy.createDummyProject('Demo Project AAA')
    cy.createDummyProject('Demo Project AAB')
    cy.createDummyProject('Demo Project ABB')

    cy.get('[data-test-id="project-list"]')
      .children()
      .should('have.length', 3)

    cy.get('input[name="q"]').type('b').should('have.value', 'b')

    cy.get('[data-test-id="project-list"]')
      .should('not.contain', 'AAA')
      .children()
      .should('have.length', 2)

    cy.get('input[name="q"]').type('b').should('have.value', 'bb')

    cy.get('[data-test-id="project-list"]')
      .should('contain', 'ABB')
      .should('not.contain', 'AAB')
      .should('not.contain', 'AAA')
      .children()
      .should('have.length', 1)

    cy.get('input[name="q"]')
      .parent()
      .children()
      .last()
      .click()

    cy.get('input[name="q"]').should('have.value', '')

    cy.get('[data-test-id="project-list"]')
      .children()
      .should('have.length', 3)
  })

  it('should filter templates', () => {
    cy.visit('/templates/')

    cy.createDummyTemplate('Demo Template AAA')
    cy.createDummyTemplate('Demo Template AAB')
    cy.createDummyTemplate('Demo Template ABB')

    cy.get('table tbody tr')
      .should('have.length', 3)

    cy.get('input[name="q"]').type('b').should('have.value', 'b')

    cy.get('table tbody tr')
      .should('have.length', 2)
      .parent()
      .should('not.contain', 'AAA')

    cy.get('input[name="q"]').type('b').should('have.value', 'bb')

    cy.get('table tbody tr')
      .should('have.length', 1)
      .parent()
      .should('contain', 'ABB')
      .should('not.contain', 'AAB')
      .should('not.contain', 'AAA')

    cy.get('input[name="q"]')
      .parent()
      .children()
      .last()
      .click()

    cy.get('input[name="q"]').should('have.value', '')

    cy.get('table tbody tr')
      .should('have.length', 3)
  })

  it('should filter questions', () => {
    cy.visit('/questions/')

    cy.createTextQuestion('Demo Question AAA')
    cy.createTextQuestion('Demo Question AAB')
    cy.createTextQuestion('Demo Question ABB')

    cy.get('table tbody tr')
      .should('have.length', 3)

    cy.get('input[name="q"]').type('b').should('have.value', 'b')

    cy.get('table tbody tr')
      .should('have.length', 2)
      .parent()
      .should('not.contain', 'AAA')

    cy.get('input[name="q"]').type('b').should('have.value', 'bb')

    cy.get('table tbody tr')
      .should('have.length', 1)
      .parent()
      .should('contain', 'ABB')
      .should('not.contain', 'AAB')
      .should('not.contain', 'AAA')

    cy.get('input[name="q"]')
      .parent()
      .children()
      .last()
      .click()

    cy.get('input[name="q"]').should('have.value', '')

    cy.get('table tbody tr')
      .should('have.length', 3)
  })
})
