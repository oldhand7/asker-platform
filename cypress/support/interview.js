    
Cypress.Commands.add('processOverviewConfirmQuestioncount', (expectedCount = 0) => {
    cy.contains('Process overview')
      .closest('div[data-test-id="interview-process-overview"]')
      .within(() => {
        cy.contains('Questions').closest('div')
          .should('contain', expectedCount)
        })
  })
  
  Cypress.Commands.add('processOverviewConfirmStageCount', (expectedCount = 1) => {
    cy.contains('Process overview')
      .closest('div[data-test-id="interview-process-overview"]')
      .within(() => {
        cy.get('ul').children().should('have.length', expectedCount)
      })
  })
  
  Cypress.Commands.add('processOverviewConfirmStageStatus', (index = 0, expectedId = 'Introduction', expectedStatus = 'Not started') => {
    cy.contains('Process overview')
    .closest('div[data-test-id="interview-process-overview"]')
    .within(() => {
      cy.get('ul')
        .within(() => {
          cy.get('li').eq(index)
            .should('contain', expectedId)
            .should('contain', expectedStatus)
        })
      })
  })
  