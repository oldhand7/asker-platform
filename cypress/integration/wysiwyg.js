describe('WYSIWYG', () => {
  beforeEach(() => {
    cy.login('joe.kirby@example.com', 'test123')
  })

  it('should create a bold text', () => {
    cy.createDummyProject('Just some project X')

    cy.contains('Just some project X').closest('ul').listFirstRowNavigate('Edit')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]').click()
          .type('The world is bold.{selectAll}')

        cy.get('button').eq(0).click()
      })

    cy.saveProject()

    cy.contains('Just some project X').closest('li').click()

    cy.addProjectCandidate('John', 'john.kirby.junior@hotmail.net').wait(1000)

    cy.contains('John')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

      cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .find('b')
      .should('contain', 'The world is bold.')
  })

  it('should create an unordered list', () => {
    cy.createDummyProject('Just some project Y')
    cy.contains('Just some project Y').closest('ul').listFirstRowNavigate('Edit')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]').click()
          .type('List of cities:{enter}')

        cy.get('button').eq(1).click()

        cy.get('[contenteditable="true"]').click()
          .type('Prague{enter}')
          .type('Berlin{enter}')
          .type('Lisbon{enter}')
          .type('Milan{enter}{enter}')
      })

    cy.saveProject()

    cy.contains('Just some project Y').closest('li').click()

    cy.addProjectCandidate('John', 'john.kirby.junior@hotmail.net').wait(1000)

    cy.contains('John')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

      cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'List of cities:')
      .find('ul')
      .within(() => {
        cy.get('li').eq(0).should('contain', 'Prague')
        cy.get('li').eq(1).should('contain', 'Berlin')
        cy.get('li').eq(2).should('contain', 'Lisbon')
        cy.get('li').eq(3).should('contain', 'Milan')
      })
  })

  it('should create a numbered list', () => {
    cy.createDummyProject('Just some project Z')

    cy.contains('Just some project Z').closest('ul').listFirstRowNavigate('Edit')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]').click()
          .type('List of animals:{enter}')

        cy.get('button').eq(2).click()

        cy.get('[contenteditable="true"]').click()
          .type('Dog{enter}')
          .type('Cat{enter}')
          .type('Horse{enter}')
          .type('Lion{enter}{enter}')
      })

    cy.saveProject()

    cy.contains('Just some project Z').closest('li').click()

    cy.addProjectCandidate('John', 'john.kirby.junior@hotmail.net').wait(1000)

    cy.contains('John')
      .closest('[data-test-id="flex-table-row"]')
      .contains('Start interview')
      .click()

      cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'List of animals:')
      .find('ol')
      .within(() => {
        cy.get('li').eq(0).should('contain', 'Dog')
        cy.get('li').eq(1).should('contain', 'Cat')
        cy.get('li').eq(2).should('contain', 'Horse')
        cy.get('li').eq(3).should('contain', 'Lion')
      })
  })
})
