describe('WYSIWYG', () => {
  beforeEach(() => {
    cy.login('joe.kirby@example.com', 'test123')
  })

  it('should create a bold text', () => {
    cy.createDummyProject('Just some project')
    cy.tableFirstRowNavigate('Edit')

    cy.get('[data-test-id="stage-1"]').click().wait(1000)

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]').click().wait(500)

        cy.get('button').eq(0).click()

        cy.get('[contenteditable="true"]').click().wait(500)
          .type('The world is bold.')
      })

    cy.contains('Save project').click()

    cy.tableFirstRowNavigate('Interviews')

    cy.addProjectCandidate('John', 'john.kirby.junior@hotmail.net').wait(2000)

    cy.tableFirstRowNavigate('Start interview')

    cy.get('[data-test-id="feature-form"]').eq(0)
      .find('strong')
      .should('contain', 'The world is bold.')
  })

  it('should create an unordered list', () => {
    cy.createDummyProject('Just some project')
    cy.tableFirstRowNavigate('Edit')

    cy.get('[data-test-id="stage-1"]').click().wait(1000)

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]').click().wait(500)
          .type('List of cities:{enter}')

        cy.get('button').eq(1).click()

        cy.get('[contenteditable="true"]').click().wait(500)
          .type('Prague{enter}')
          .type('Berlin{enter}')
          .type('Lisbon{enter}')
          .type('Milan{enter}{enter}')
      })

    cy.contains('Save project').click()

    cy.tableFirstRowNavigate('Interviews')

    cy.addProjectCandidate('John', 'john.kirby.junior@hotmail.net').wait(2000)

    cy.tableFirstRowNavigate('Start interview')

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
    cy.createDummyProject('Just some project')
    cy.tableFirstRowNavigate('Edit')

    cy.get('[data-test-id="stage-1"]').click().wait(1000)

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('[contenteditable="true"]').click().wait(500)
          .type('List of animals:{enter}')

        cy.get('button').eq(2).click().wait(1000)

        cy.get('[contenteditable="true"]').click().wait(500)
          .type('Dog{enter}')
          .type('Cat{enter}')
          .type('Horse{enter}')
          .type('Lion{enter}{enter}')
      })

    cy.contains('Save project').click()

    cy.tableFirstRowNavigate('Interviews')

    cy.addProjectCandidate('John', 'john.kirby.junior@hotmail.net').wait(2000)

    cy.tableFirstRowNavigate('Start interview')

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
