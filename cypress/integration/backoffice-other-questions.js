describe('Backoffice other questions', () => {

    beforeEach(() => {
        cy.login('joe.woodkid@example.com', 'test123');
    })

    it('Should create text question', () => {
            cy.visit('/admin/#/questions/create')
      
            cy.get('.MuiSelect-root#companyId').click()
            cy.get('#menu-companyId').contains('Woodkid & Co').click()
      
            cy.get('.MuiSelect-root#type').click()
            cy.get('#menu-type').contains('Other').click()
      
            cy.get('.MuiSelect-root#subtype').click()
            cy.get('#menu-subtype').contains('Text').click()
      
            cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();
      
            cy.get('[id="translatable-content-en"]').within(() => {
              cy.get('input[name="name.en"]').type('Your favorite movie?')
      
              cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Movie movie movie.')
              cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Movie movie movie!')
            })
      
            cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();
      
            cy.get('[id="translatable-content-se"]').within(() => {
              cy.get('input[name="name.se"]').type('Your favorite movie? (SE)')
      
              cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Movie movie movie. (SE)')
              cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Movie movie movie! (SE)')
            })
      
            cy.contains('Save').wait(1000).click()
      
            cy.get('table tbody tr')
              .first()
              .within(() => {
                cy.get('td').eq(1).should('contain', 'Your favorite movie?')
                cy.get('td').eq(2).should('contain', 'Other')
                cy.get('td').eq(3).should('contain', 'Text')
                cy.get('td').eq(4).should('contain', 'Woodkid & Co')
              })
      
            cy.visit('/questions/')
      
            cy.get('table tbody tr').first()
              .should('contain', 'Your favorite movie?')
              .should('contain', 'Other')
              .should('contain', 'Text')
      
            cy.changeLanguage('SE')
      
            cy.get('table tbody tr').first()
              .should('contain', 'Your favorite movie? (SE)')
              .listRowNavigate('Edit')
      
            cy.get('input[name="name.se"]').should('have.value', 'Your favorite movie? (SE)');
      
            cy.get('[data-test-id="html-input-field"]#desc').should('contain', 'Movie movie movie. (SE)')
      
           cy.createDummyProject('Project movie')
      
           cy.contains('Project movie').closest('li').listRowNavigate('Edit')
      
           cy.addStage('Other')
            .wait(1000)
      
            cy.get('[data-test-id="feature-form"]')
            .within(() => {
              cy.contains('Your favorite movie? (SE)')
                .closest('li')
                .find('button[data-test-id="add-question"]').first().click()
            })
      
            cy.contains('Save project').click()
      
            cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')
      
           cy.contains('Project movie').closest('li').click()
      
           cy.addProjectCandidate('Tom', 'tom@foobar.net')
      
           cy.contains('Start interview').click()

           cy.get('#language-choose-modal').trigger('keyup', { code: "Escape" })
      
            cy.processOverviewConfirmQuestioncount(1)
            cy.processOverviewConfirmStageCount(2);
            cy.processOverviewConfirmStageStatus(1, 'Other', 'Not started')

            cy.contains('Next step').click();
    
            cy.get('[data-test-id="feature-form"]').eq(1)
              .within(() => {
                cy.get('[data-test-id="other-question-int"]').eq(0)
                .should('contain', 'Other question')
                .should('contain', 'Your favorite movie? (SE)')
                .should('contain', 'Movie movie movie. (SE)')
                .find('[data-test-id="html-input-field"]').first()
                .type('28 days later')
              })
      
            cy.contains('Complete interview').click();
      
            cy.location('pathname').should('contain', '/overview/')
            
            cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
              .should('contain', '0%')
    })
})