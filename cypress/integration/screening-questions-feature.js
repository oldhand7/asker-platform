describe('Screening question feature', () => {
  beforeEach(() => {
    cy.login('jane.philips@example.com', 'test123', 'screening-questions-feature')
  })

  it('allows creating choice/multichoice questions', () => {
    const confirmStub = cy.stub();
    cy.on('window:confirm', confirmStub)

    cy.visit('/questions/create/screening')

    cy.get('[data-test-id="title"]').should('contain', 'Create a screening question')

    cy.get('ul[data-test-id="screening-question-options"]')
      .children()
      .should('have.length', 4)
      .parent()
      .within(() => {
        cy.get('li').eq(0).should('contain', 'Yes/No');
        cy.get('li').eq(1).should('contain', 'Multiple choice');
        cy.get('li').eq(2).should('contain', 'Range');
        cy.get('li').eq(3).should('contain', 'Text');
      })

    cy.contains('Yes/No').click()
    cy.get('[data-test-id="screening-question-options"]').should('not.exist')
    cy.get('[data-test-id="title"]').should('contain', 'Yes/No')
    cy.get('input[type="checkbox"]').should('not.be.checked')
    cy.contains('Cancel').click();
    cy.get('[data-test-id="screening-question-options"]').should('exist')

    cy.contains('Multiple choice').click();
    cy.get('[data-test-id="title"]').should('contain', 'Multiple choice')

    cy.get('[data-test-id="choice-question-form"]')
      .within(() => {
        cy.get('input[name="name"]').type('Some multichoice question')
        cy.get('textarea[name="desc"]').type('Some multichoice question description')

        cy.get('[data-test-id="answers-form"]')
          .find('ul')
          .children()
          .should('have.length', 2)
          .parent()
          .within(() => {
            cy.get('li').eq(0).find('input[name="answers[]"]').type('AAA{enter}')
            cy.get('li').eq(1).find('input[name="answers[]"]').should('be.focused').type('BBB{enter}').wait(200)
            cy.get('li').eq(2).find('input[name="answers[]"]').should('be.focused').type('CCC')
          })
          .parent()
          .contains('Add answer').click().click()
          .closest('[data-test-id="answers-form"]')
          .find('ul')
          .children()
          .should('have.length', 5)
          .parent()
          .within(() => {
            cy.get('li').eq(3).find('input').type('DDD').wait(200)
            cy.get('li').eq(4).find('[data-test-id="trash-button"]').click()
          })
          .children()
          .should('have.length', 4)
      })

    cy.get('input[type="checkbox"]').should('be.checked')

    cy.contains("Create question").click()

    cy.get('[data-test-id="alert-success"]')
      .should('contain', 'Question created')

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Screening').should('contain', 'Multiple choice')
        cy.get('td').eq(2).contains('Some multichoice question')
        cy.get('td').eq(4).find('button').click().parent().contains('Edit').click()
      })

    cy.title().should('include', 'Edit question')
    cy.get('[data-test-id="title"]')
      .should('contain', 'Edit screening question')
      .should('contain', 'Multiple choice')

    cy.get('[data-test-id="answers-form"]')
      .within(() => {
          cy.get('input').eq(0).should('have.value', 'AAA')
          cy.get('input').eq(1).should('have.value', 'BBB')
          cy.get('input').eq(2).should('have.value', 'CCC')
          cy.get('input').eq(3).should('have.value', 'DDD')
      })

    cy.get('input[name="name"]').type('{selectAll}{backspace}Some single choice question')
    cy.get('textarea[name="desc"]').type('{selectAll}{backspace}Some single choice question description')
    cy.get('input[type="checkbox"]').uncheck()

    cy.contains('Save question').click()

    cy.get('[data-test-id="alert-success"]')
      .should('contain', 'Question saved')

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Screening').should('contain', 'Yes/No')
        cy.get('td').eq(2).contains('Some single choice question')
        cy.get('td').eq(4).find('button').click().parent().contains('Delete').click()
      })

    cy.get('[data-test-id="alert-success"]')
      .should('contain', 'Question deleted')

    cy.get('table thead tr')
      .first()
      .should('not.contain', 'Some single choice question')

    cy.wrap(confirmStub)
      .should('be.calledWithMatch', 'Are you sure?')
      .should('be.called', 2)
  })
})
