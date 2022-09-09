describe('Config templates', () => {
    beforeEach(() => {
        cy.login('joe.woodkid@example.com', 'test123');
    })

    it('should configure project introduction', () => {
        cy.createEmptyProject('Just some project')

        cy.contains('Just some project').closest('li').listRowNavigate('Edit')

        cy.addStage('Introduction')

        cy.get('[data-test-id="feature-form"]')
          .within(() => {
            cy.root().findHtmlInputAndType('Just some text to be used later 1')
            cy.contains('Save as template').click()
            cy.get('input[name="template_name"]').type('My introduction 1')
            cy.contains('Save').click()
          })

        cy.reload()

        cy.addStage('Introduction')

        cy.get('[data-test-id="feature-form"]')
          .within(() => {
            cy.root().findHtmlInputAndType('Just some text to be used later 2')
            cy.contains('Save as template').click()
            cy.get('input[name="template_name"]').type('My introduction 2')
            cy.contains('Save').click()
          })

        cy.reload()

        cy.addStage('Introduction')

        cy.get('[data-test-id="feature-form"]')
          .within(() => {
            cy.contains('Templates').closest('div').as('templates')
            cy.get('@templates').contains('Choose').click()
            cy.contains('My introduction 1').click()
            cy.get('[data-test-id="html-input-field"]').should('contain', 'Just some text to be used later 1')
            cy.get('@templates').contains('My introduction 1').click()
            cy.contains('My introduction 2').click()
            cy.get('[data-test-id="html-input-field"]').should('contain', 'Just some text to be used later 2')
            cy.get('input[name="template_name"]').type('{selectAll}My introduction 2!')
            cy.contains('Save').click()
            cy.get('@templates').contains('My introduction 2').click()
            cy.contains('My introduction 1').closest('li').find('button').click()
            cy.contains('Delete').click();
          })

        cy.reload()

        cy.addStage('Introduction')

        cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.contains('Templates').closest('div').as('templates')
          cy.get('@templates').contains('Choose').click()

          cy.get('@templates').should('not.contain', 'My introduction 1')
          cy.get('@templates').should('contain', 'My introduction 2!')
        })
    })

    it('should configure project introduction', () => {
      cy.createEmptyProject('Just some project')
  
      cy.contains('Just some project').closest('li').listRowNavigate('Edit')
  
      cy.addStage('Summary')
  
      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.root().findHtmlInputAndType('Just some text to be used later 1')
          cy.contains('Save as template').click()
          cy.get('input[name="template_name"]').type('My summary 1')
          cy.contains('Save').click()
        })
  
      cy.reload()
  
      cy.addStage('Summary')
  
      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.root().findHtmlInputAndType('Just some text to be used later 2')
          cy.contains('Save as template').click()
          cy.get('input[name="template_name"]').type('My summary 2')
          cy.contains('Save').click()
        })
  
      cy.reload()
  
      cy.addStage('Summary')
  
      cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.contains('Templates').closest('div').as('templates')
          cy.get('@templates').contains('Choose').click()
          cy.contains('My summary 1').click()
          cy.get('[data-test-id="html-input-field"]').should('contain', 'Just some text to be used later 1')
          cy.get('@templates').contains('My summary 1').click()
          cy.contains('My summary 2').click()
          cy.get('[data-test-id="html-input-field"]').should('contain', 'Just some text to be used later 2')
          cy.get('input[name="template_name"]').type('{selectAll}My summary 2!')
          cy.contains('Save').click()
          cy.get('@templates').contains('My summary 2').click()
          cy.contains('My summary 1').closest('li').find('button').click()
          cy.contains('Delete').click();
        })
  
      cy.reload()
  
      cy.addStage('Summary')
  
      cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Templates').closest('div').as('templates')
        cy.get('@templates').contains('Choose').click()
  
        cy.get('@templates').should('not.contain', 'My summary 1')
        cy.get('@templates').should('contain', 'My summary 2!')
      })
  })
})