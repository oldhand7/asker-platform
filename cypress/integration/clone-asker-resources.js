describe('Clone Asker resources', () => {
  before(() => {
    cy.simpleLogin('admin@askertech.com', 'test123', true)

    cy.createDummyTemplate('Asker Public Template 123')
    cy.createOtherTextQuestion({ name: 'Asker Public Question 123'})

    cy.visit('/logout/');
  })

  beforeEach(() => {
    cy.login('joe.spencer@example.com', 'test123')
  })

  it('modified template should be saved as user owned copy', () => {
    cy.visit('/templates/')

    cy.contains('Asker Public Template 123')
      .closest('li')
      .should('contain', 'Asker Public Template 123')
      .should('contain', 'John Powers')
      .should('have.attr', 'data-company-id', 'asker')
      .closest('ul')
      .listFirstRowNavigate('Edit copy')

    cy.contains('Save template').click()

    cy.get('[data-test-id="template-list"] > li')
      .should('have.length', 2)
      .first()
      .should('contain', 'Asker Public Template 123')
      .should('contain', 'Joe Spencer')
      .should('have.attr', 'data-company-id')
      .then(companyId => {
        expect(companyId).to.not.eq('asker')
      })
  })

  it('modified question should be saved as user owned copy', () => {
    cy.visit('/questions/')

    cy.get('table tbody tr')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'data-company-id', 'asker')
      .should('contain', 'Asker Public Question 123')
      .tableFirstRowNavigate('Edit copy')

    cy.contains('Save question').click()

    cy.get('table tbody tr')
      .should('have.length', 2)
      .first()
      .should('contain', 'Asker Public Question 123')
      .should('have.attr', 'data-company-id')
      .then(companyId => {
        expect(companyId).to.not.eq('asker')
      })
  })

  after(() => {
    cy.logout()

    cy.simpleLogin('admin@askertech.com', 'test123', true)

    const confirmStub = cy.stub();
    cy.on('window:confirm', confirmStub)

    cy.visit('/templates/')

    cy.get('[data-test-id="template-list"]').listFirstRowNavigate('Delete')

    cy.get("[data-test-id='alert-success']").should('contain', 'Template deleted')

    cy.visit('/questions/')

    cy.tableFirstRowNavigate('Delete');

    cy.get("[data-test-id='alert-success']").should('contain', 'Question deleted')

    cy.wrap(confirmStub)
      .should('be.called', 2)

    cy.logout()
  })
})
