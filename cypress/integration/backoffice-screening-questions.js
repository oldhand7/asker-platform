describe('Backoffice screening questions', () => {

    beforeEach(() => {
        cy.login('joe.woodkid@example.com', 'test123');
    })

    it('Should create choice question', () => {
        cy.visit('/admin/#/questions/create')

        cy.get('.MuiSelect-root#companyId').click()
        cy.get('#menu-companyId').contains('Woodkid & Co').click()

        cy.get('.MuiSelect-root#type').click()
        cy.get('#menu-type').contains('Screening').click()

        cy.get('.MuiSelect-root#subtype').click()
        cy.get('#menu-subtype').contains('Yes/No').click()

        cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();

        cy.get('[id="translatable-content-en"]').within(() => {
          cy.get('input[name="name.en"]').type('Do you like fruits?')

          cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Fruits fruits fruits.')
          cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Fruits fruits fruits!')
        })

            cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();

            cy.get('[id="translatable-content-se"]').within(() => {
            cy.get('input[name="name.se"]').type('Do you like fruits? (SE)')

            cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Fruits fruits fruits. (SE)')
            cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Fruits fruits fruits! (SE)')
            })

            cy.get('a[role="tab"]').contains('Answers', { matchCase: false}).click();

            cy.contains('Add').click()

            cy.get('input[name="answers[0].name.en"]').type('Yes')
            cy.get('input[name="answers[0].name.se"]').type('Yes (SE)')

            cy.contains('Add').click()

            cy.get('input[name="answers[1].name.en"]').type('No')
            cy.get('input[name="answers[1].name.se"]').type('No (SE)')

        cy.contains('Save').wait(1000).click()

        cy.get('table tbody tr')
          .first()
          .within(() => {
            cy.get('td').eq(1).should('contain', 'Do you like fruits?')
            cy.get('td').eq(2).should('contain', 'Screening')
            cy.get('td').eq(3).should('contain', 'Yes/No')
            cy.get('td').eq(4).should('contain', 'Woodkid & Co')
          })

        cy.visit('/questions/')

        cy.get('table tbody tr').first()
          .should('contain', 'Do you like fruits?')
          .should('contain', 'Screening')

        cy.changeLanguage('SE')


        cy.get('table tbody tr').first()
          .should('contain', 'Do you like fruits? (SE)')
          .should('contain', 'Screening (SE)')
          .listNavigate('Edit')

        cy.get('input[name="name.se"]').should('have.value', 'Do you like fruits? (SE)');

        cy.get('[data-test-id="html-input-field"]#desc').should('contain', 'Fruits fruits fruits. (SE)')

        cy.get('input[name="answers[0].name.se"]').should('have.value', 'Yes (SE)');
        cy.get('input[name="answers[1].name.se"]').should('have.value', 'No (SE)');

        cy.contains('Allow multiple answers?').closest('div')
          .find('input[type="checkbox"]').should('not.be.checked')

       cy.createDummyProject('Project fruits')

       cy.contains('Project fruits').closest('li').listNavigate('Edit')

       cy.contains('Add stage').click()

       cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-2"] .Droppable')
        .wait(1000)

        cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.contains('Do you like fruits? (SE)')
            .closest('li')
            .find('button[data-test-id="add-question"]').first().click()
        })

        cy.contains('Save project').click()

        cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')

       cy.contains('Project fruits').closest('li').click()

       cy.addProjectCandidate('Tom', 'tom@foobar.net')

       cy.contains('Start interview').click()

       cy.get('[data-test-id="feature-form"]').eq(1)
        .within(() => {
            cy.get('[data-test-id="screening-question-int"]').eq(0)
            .should('contain', 'Do you like fruits? (SE)')
            .should('contain', 'Fruits fruits fruits. (SE)')
            .find('[data-test-id="question-answers"]')
            .children()
            .should('have.length', 2)
            .parent()
            .within(() => {
              cy.get('li').eq(0).find('label')
                .should('contain', 'Yes (SE)')
                .click()

              cy.get('li').eq(1).find('label')
                .should('contain', 'No (SE)')
            })
        })
        .wait(1000)

       cy.contains('Complete interview').click();

       cy.location('pathname').should('contain', '/overview/')
       
       cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
         .should('contain', '0%')
    })

    it('Should create multichoice question', () => {
      cy.visit('/admin/#/questions/create')

      cy.get('.MuiSelect-root#companyId').click()
      cy.get('#menu-companyId').contains('Woodkid & Co').click()

      cy.get('.MuiSelect-root#type').click()
      cy.get('#menu-type').contains('Screening').click()

      cy.get('.MuiSelect-root#subtype').click()
      cy.get('#menu-subtype').contains('Multichoice').click()

      cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();

      cy.get('[id="translatable-content-en"]').within(() => {
        cy.get('input[name="name.en"]').type('What music do you like?')

        cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Music music music.')
        cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Music music music!')
      })

          cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();

          cy.get('[id="translatable-content-se"]').within(() => {
          cy.get('input[name="name.se"]').type('What music do you like? (SE)')

          cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Music music music. (SE)')
          cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Music music music! (SE)')
          })

          cy.get('a[role="tab"]').contains('Answers', { matchCase: false}).click();

          cy.contains('Add').click()

          cy.get('input[name="answers[0].name.en"]').type('Pop')
          cy.get('input[name="answers[0].name.se"]').type('Pop (SE)')

          cy.contains('Add').click()

          cy.get('input[name="answers[1].name.en"]').type('Rnb')
          cy.get('input[name="answers[1].name.se"]').type('Rnb (SE)')

          cy.contains('Add').click()

          cy.get('input[name="answers[2].name.en"]').type('Rock')
          cy.get('input[name="answers[2].name.se"]').type('Rock (SE)')

          cy.contains('Add').click()

          cy.get('input[name="answers[3].name.en"]').type('Classical')
          cy.get('input[name="answers[3].name.se"]').type('Classical (SE)')

      cy.contains('Save').wait(1000).click()

      cy.get('table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(1).should('contain', 'What music do you like?')
          cy.get('td').eq(2).should('contain', 'Screening')
          cy.get('td').eq(3).should('contain', 'Multichoice')
          cy.get('td').eq(4).should('contain', 'Woodkid & Co')
        })

      cy.visit('/questions/')

      cy.get('table tbody tr').first()
        .should('contain', 'What music do you like?')
        .should('contain', 'Screening')
        .should('contain', 'Multiple choice')

      cy.changeLanguage('SE')

      cy.get('table tbody tr').first()
        .should('contain', 'What music do you like? (SE)')
        .should('contain', 'Screening (SE)')
        .listNavigate('Edit')

      cy.get('input[name="name.se"]').should('have.value', 'What music do you like? (SE)');

      cy.get('[data-test-id="html-input-field"]#desc').should('contain', 'Music music music. (SE)')

      cy.get('input[name="answers[0].name.se"]').should('have.value', 'Pop (SE)');
      cy.get('input[name="answers[1].name.se"]').should('have.value', 'Rnb (SE)');
      cy.get('input[name="answers[2].name.se"]').should('have.value', 'Rock (SE)');
      cy.get('input[name="answers[3].name.se"]').should('have.value', 'Classical (SE)');

      cy.contains('Allow multiple answers?').closest('div')
        .find('input[type="checkbox"]').should('be.checked')

     cy.createDummyProject('Project music')

     cy.contains('Project music').closest('li').listNavigate('Edit')

     cy.contains('Add stage').click()

     cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-2"] .Droppable')
      .wait(1000)

      cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('What music do you like? (SE)')
          .closest('li')
          .find('button[data-test-id="add-question"]').first().click()
      })

      cy.contains('Save project').click()

      cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')

     cy.contains('Project music').closest('li').click()

     cy.addProjectCandidate('Tom', 'tom@foobar.net')

     cy.contains('Start interview').click()

      cy.processOverviewConfirmQuestioncount(1)
      cy.processOverviewConfirmStageCount(2);
      cy.processOverviewConfirmStageStatus(1, 'Screening questions', 'Not started')

      cy.get('[data-test-id="feature-form"]').eq(1)
        .within(() => {
          cy.get('[data-test-id="screening-question-int"]').eq(0)
          .should('contain', 'Screening question')
          .should('contain', 'What music do you like? (SE)')
          .should('contain', 'Music music music.')
          .find('[data-test-id="question-answers"]')
          .children()
          .should('have.length', 4)
          .parent()
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'Pop (SE)')
              .find('input[type="checkbox"]')
              .click()
     
            cy.get('li').eq(1)
              .should('contain', 'Rnb (SE)')
              .find('input[type="checkbox"]')
              .click()
     
            cy.get('li').eq(2)
              .should('contain', 'Rock (SE)')
              .find('input[type="checkbox"]')
     
            cy.get('li').eq(3)
              .should('contain', 'Classical (SE)')
              .find('input[type="checkbox"]')
          })
        })
        .wait(1000)

     cy.contains('Complete interview').click();

     cy.location('pathname').should('contain', '/overview/')
     
     cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
       .should('contain', '0%')
    })

    it('Should create range question', () => {
      cy.visit('/admin/#/questions/create')

      cy.get('.MuiSelect-root#companyId').click()
      cy.get('#menu-companyId').contains('Woodkid & Co').click()

      cy.get('.MuiSelect-root#type').click()
      cy.get('#menu-type').contains('Screening').click()

      cy.get('.MuiSelect-root#subtype').click()
      cy.get('#menu-subtype').contains('Range').click()

      cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();

      cy.get('[id="translatable-content-en"]').within(() => {
        cy.get('input[name="name.en"]').type('How deep is Atlantic ocean?')

        cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Ocean ocean ocean.')
        cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Ocean ocean ocean!')
      })

      cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();

      cy.get('[id="translatable-content-se"]').within(() => {
        cy.get('input[name="name.se"]').type('How deep is Atlantic ocean? (SE)')

        cy.contains('Description').closest('div').find('[data-testid="quill"]').type('Ocean ocean ocean. (SE)')
        cy.contains('Note').closest('div').find('[data-testid="quill"]').type('Ocean ocean ocean! (SE)')
      })

      cy.get('a[role="tab"]').contains('Setup', { matchCase: false}).click();

      cy.get('input[name="min"]').type('{selectAll}1000')
      cy.get('input[name="max"]').type('{selectAll}20000')
      cy.get('input[name="step"]').type('{selectAll}100')
      cy.get('input[name="unit"]').type('{selectAll}m')

      cy.contains('Save').wait(1000).click()

      cy.get('table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(1).should('contain', 'How deep is Atlantic ocean?')
          cy.get('td').eq(2).should('contain', 'Screening')
          cy.get('td').eq(3).should('contain', 'Range')
          cy.get('td').eq(4).should('contain', 'Woodkid & Co')
        })

      cy.visit('/questions/')

      cy.get('table tbody tr').first()
        .should('contain', 'How deep is Atlantic ocean?')
        .should('contain', 'Screening')
        .should('contain', 'Range')

      cy.changeLanguage('SE')

      cy.get('table tbody tr').first()
        .should('contain', 'How deep is Atlantic ocean? (SE)')
        .should('contain', 'Screening (SE)')
        .listNavigate('Edit')

      cy.get('input[name="name.se"]').should('have.value', 'How deep is Atlantic ocean? (SE)');

      cy.get('[data-test-id="html-input-field"]#desc').should('contain', 'Ocean ocean ocean. (SE)')

      cy.get('input[name="min"]').should('have.value', '1000');
      cy.get('input[name="max"]').should('have.value', '20000');
      cy.get('input[name="step"]').should('have.value', '100');
      cy.get('input[name="unit"]').should('have.value', 'm');

     cy.createDummyProject('Project ocean')

     cy.contains('Project ocean').closest('li').listNavigate('Edit')

     cy.contains('Add stage').click()

     cy.get('[data-test-id="feature-screening-questions"]').drag('[data-test-id="stage-2"] .Droppable')
      .wait(1000)

      cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('How deep is Atlantic ocean? (SE)')
          .closest('li')
          .find('button[data-test-id="add-question"]').first().click()
      })

      cy.contains('Save project').click()

      cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')

     cy.contains('Project ocean').closest('li').click()

     cy.addProjectCandidate('Tom', 'tom@foobar.net')

     cy.contains('Start interview').click()

      cy.processOverviewConfirmQuestioncount(1)
      cy.processOverviewConfirmStageCount(2);
      cy.processOverviewConfirmStageStatus(1, 'Screening questions', 'Not started')

      cy.get('[data-test-id="feature-form"]').eq(1)
        .within(() => {
          cy.get('[data-test-id="screening-question-int"]').eq(0)
          .should('contain', 'Screening question')
          .should('contain', 'How deep is Atlantic ocean?')
          .should('contain', 'Ocean ocean ocean.')
          .within(() => {
            cy.get('[role="slider"]').eq(0)
              .should('have.attr', 'aria-valuemin', '1000')
              .should('have.attr', 'aria-valuenow', '1000')
              .should('contain', '1000 m')

            cy.get('[role="slider"]').eq(1)
              .should('have.attr', 'aria-valuemax', '20000')
              .should('have.attr', 'aria-valuenow', '10000')
              .should('contain', '10000 m')
          })
        })
        .wait(1000)


      cy.contains('Next step').click();
      cy.contains('Complete interview').click();

      cy.location('pathname').should('contain', '/overview/')
      
      cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
        .should('contain', '0%')
    })
})