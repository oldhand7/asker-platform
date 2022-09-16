describe('Clone Asker resources', () => {
  it('modified template should be saved as user owned copy', () => {
    cy.simpleLogin('admin@askertech.com', 'test123', true)

    cy.createDummyTemplate('Asker Public Template 123')

    cy.logout()

    cy.simpleLogin('joe.spencer@example.com', 'test123', true)

    cy.visit('/templates/')

    cy.contains('Asker Public Template 123')
      .closest('li')
      .should('contain', 'Asker Public Template 123')
      .should('contain', 'John Powers')
      .should('have.attr', 'data-company-id', 'asker')
      .listRowNavigate('Edit copy')

    cy.contains('Save template').click()

    cy.get("[data-test-id='alert-success']").should('contain', 'Template saved')

    cy.contains('Asker Public Template 123')
      .closest('li')
      .should('contain', 'Asker Public Template 123')
      .should('contain', 'Joe Spencer')
      .should('have.attr', 'data-company-id')
      .then(companyId => {
        expect(companyId).to.not.eq('asker')
      })
  })

  it('modified question should be saved as user owned copy', () => {
    cy.simpleLogin('admin@askertech.com', 'test123', true)

    cy.createOtherTextQuestion({ name: 'Asker Public Question 123'})

    cy.logout()

    cy.simpleLogin('joe.spencer@example.com', 'test123', true)

    cy.visit('/questions/')

    cy.get('table tbody tr')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'data-company-id', 'asker')
      .should('contain', 'Asker Public Question 123')
      .tableFirstRowNavigate('Edit copy')

    cy.contains('Save question').click()

    cy.get("[data-test-id='alert-success']").should('contain', 'Question saved')

    cy.get('table tbody tr')
      .should('have.length', 2)
      .first()
      .should('contain', 'Asker Public Question 123')
      .should('have.attr', 'data-company-id')
      .then(companyId => {
        expect(companyId).to.not.eq('asker')
      })
  })

  it('modified introduction text users owned', () => {
    cy.simpleLogin('admin@askertech.com', 'test123', true)

    cy.createDummyProject('Just some project 1')

    cy.contains('Just some project 1').closest('li').listRowNavigate('Edit')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('English').click()
        cy.root().findHtmlInputAndType('{selectAll}Mickey mouse loves everybody.')
        cy.contains('Swedish').click()
        cy.root().findHtmlInputAndType('{selectAll}Mickey mouse loves everybody. SE')
        cy.contains('Save as template').click()
        cy.get('input[name="template_name"]').type('Introduction (Asker)')
        cy.contains('Save').click()
      })

    cy.saveProject()

    cy.logout()

    cy.simpleLogin('joe.spencer@example.com', 'test123', true)

    cy.visit('/projects/')

    cy.createDummyProject('Just some project FOO')

    cy.contains('Just some project FOO').closest('li').listRowNavigate('Edit')

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Templates').closest('div').as('templates')
        cy.get('@templates').contains('Choose').click()
        cy.contains('Introduction (Asker)').click()
        cy.contains('English').click()
        cy.get('[data-test-id="html-input-field"]').should('contain', 'Mickey mouse loves everybody.')
        cy.root().findHtmlInputAndType('{selectAll}+en')
        cy.contains('Swedish').click()
        cy.get('[data-test-id="html-input-field"]').should('contain', 'Mickey mouse loves everybody. SE')
        cy.root().findHtmlInputAndType('{selectAll}+se')
        cy.get('input[name="template_name"]').type('{selectAll}My template')
        cy.contains('Save').click()

        cy.get('@templates').should('contain', 'My template').click()

        cy.get('@templates').find('ul')
          .within(() => {
            cy.get('li').eq(0).should('contain', 'Introduction (Asker)')
            cy.get('li').eq(1).should('contain', 'My template')
          })
      })
  })
})
