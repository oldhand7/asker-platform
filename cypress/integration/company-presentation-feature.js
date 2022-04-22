describe('Company presentation feature', () => {
  beforeEach(() => {
    //@NOTE: this could conflict
    cy.login('jane.philips@example.com', 'test123')
  })

  it('protects against abusive file uploads and allows uploading of image and document files', () => {
    const confirmStub = cy.stub();

    cy.on('window:confirm', confirmStub)

    cy.createDummyProject('Sales manager').wait(2000)

    cy.get('table tbody tr').first().click()
    cy.contains('Edit', { matchCase: false }).click()

    cy.get('[data-test-id="feature-company-presentation"]').drag('[data-test-id="stage-2"] .Droppable')

    cy.get('[data-test-id="stage-2"]')
      .contains('Company presentation')
      .click()

    cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.get('table').should('not.exist')
        cy.get('textarea').type('Our company is good company.')

        cy.get('[data-test-id="file-upload-area"]')
          .should('contain', 'Drag and Drop files here')
          .should('contain', 'Maximum file size: 1MB')
          .should('contain', 'Max files per upload: 3')
          .should('contain', 'Allowed formats: .pdf, .jpg, .png, .jpeg, .gif')
          .find('input[type="file"]')
          .first()
          .attachFile('uploads/corporate-presentation.pdf')

        cy.get('.form-error')
          .should('contain', 'Some files exceed maximum allowed file size - 1MB.')

        cy.get('[data-test-id="file-upload-area"]')
          .find('input[type="file"]')
          .first()
          .attachFile(['uploads/office.jpg', 'uploads/File A.pdf'])

        cy.get('.form-error').should('not.exist')
        cy.get('.form-success').should('exist').should('contain', 'Upload success.')

        cy.get('table thead tr')
          .first()
          .within(() => {
            cy.get('th').eq(0).should('contain', 'Preview');
            cy.get('th').eq(1).should('contain', 'Name');
            cy.get('th').eq(2).should('contain', 'Size');
            cy.get('th').eq(3).should('contain', '#');
          })

        cy.get('table tbody')
          .within(() => {
            cy.contains('office.jpg')
              .closest('tr')
              .within(() => {
                cy.get('td').eq(0).find('img').should('exist');
                cy.get('td').eq(1).find('a').should('contain', 'office.jpg');
                cy.get('td').eq(2).should($td => {
                  expect($td.get(0).innerText).to.match(/^[\d\.]+\sKiB$/)
                });
                cy.get('td').eq(3).find('button[data-test-id="trash-button"]').should('exist');
              })

            cy.contains('File A.pdf')
              .closest('tr')
              .within(() => {
                cy.get('td').eq(0).find('img').should('not.exist');
                cy.get('td').eq(1).find('a').should('contain', 'File A.pdf');
                cy.get('td').eq(2).should($td => {
                  expect($td.get(0).innerText).to.match(/^[\d\.]+\sKiB$/)
                });
                cy.get('td').eq(3).find('button[data-test-id="trash-button"]').should('exist').click()
              })

            cy.get('tr').should('have.length', 1).first().should('not.contain', 'File A.pdf')
          })

          cy.get('[data-test-id="file-upload-area"]')
            .find('input[type="file"]')
            .first()
            .attachFile('uploads/office.xyz')

          cy.get('.form-success').should('not.exist')
          cy.get('.form-error')
            .should('contain', 'Your uploads have files that are not allowed.')

          cy.get('[data-test-id="file-upload-area"]')
            .find('input[type="file"]')
            .first()
            .attachFile(['uploads/File A.pdf', 'uploads/File B.pdf', 'uploads/File C.pdf'])

          cy.get('.form-error')
            .should('contain', 'You are trying to upload 3 files, but you can only upload 2!')

          cy.get('[data-test-id="file-upload-area"]')
            .find('input[type="file"]')
            .first()
            .attachFile(['uploads/File A.pdf', 'uploads/File B.pdf'])

          cy.get('table tbody tr').should('have.length', 3)
          cy.get('[data-test-id="file-upload-area"]').should('not.exist')
      })
      .should('contain', 'You have reached file upload limit.')

      cy.wrap(confirmStub)
        .should('be.calledWithMatch', 'Are you sure?')
        .should('be.called', 1)
  })
})
