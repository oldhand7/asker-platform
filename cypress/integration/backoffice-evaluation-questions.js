describe('Backoffice evaluation questions', () => {
    beforeEach(() => {
        cy.login('joe.woodkid@example.com', 'test123');
    })

    it('Should create competency question', () => {
        cy.visit('/questions/')

        cy.get('table').should('contain', 'No questions')

        cy.visit('/admin/#/criteriaOptions/create')

        cy.get('#react-admin-title').should('contain', 'Create Criterias');

        cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();

        cy.get('[id="translatable-content-en"]').within(() => {
          cy.get('input[name="name.en"]').type('C1')
          cy.get('[data-testid="quill"]').type('C1C1C1')
        })

        cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();

        cy.get('[id="translatable-content-se"]').within(() => {
          cy.get('input[name="name.se"]').type('C1_SE')
          cy.get('[data-testid="quill"]').type('C1C1C1_SE')
        })

        cy.get('.MuiSelect-root#type').click()
        cy.get('#menu-type').contains('Competency').click()

        cy.get('.MuiSelect-root#companyId').click()
        cy.get('#menu-companyId').contains('Woodkid & Co').click()

        cy.contains('Save').click()

        cy.get('table tbody tr')
          .first()
          .within(() => {
            cy.get('td').eq(1).should('contain', 'C1')
            cy.get('td').eq(2).should('contain', 'Competency')
            cy.get('td').eq(3).should('contain', 'Woodkid & Co')
          })

        cy.visit('/admin/#/questions/create')

        cy.get('.MuiSelect-root#companyId').click()
        cy.get('#menu-companyId').contains('Woodkid & Co').click()

        cy.get('.MuiSelect-root#type').click()
        cy.get('#menu-type').contains('Evaluation').click()

        cy.get('.MuiSelect-root#subtype').click()
        cy.get('#menu-subtype').contains('Competency').click()

        cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();

        cy.get('[id="translatable-content-en"]').within(() => {
          cy.get('input[name="name.en"]').type('Are you familiar with C1?')

          cy.contains('Description').closest('div').find('[data-testid="quill"]').type('C1desc')
          cy.contains('Note').closest('div').find('[data-testid="quill"]').type('C1note')
        })

        cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();

        cy.get('[id="translatable-content-se"]').within(() => {
          cy.get('input[name="name.se"]').type('Are you familiar with C1_SE?')

          cy.contains('Description').closest('div').find('[data-testid="quill"]').type('C1desc_SE')
          cy.contains('Note').closest('div').find('[data-testid="quill"]').type('C1note_SE')
        })

        cy.get('a[role="tab"]').contains('Criteria', { matchCase: false}).click();

        cy.get('.MuiSelect-root#criteriaId').click()
        cy.get('#menu-criteriaId').contains('C1').first().click()

        cy.get('a[role="tab"]').contains('Follow-up', { matchCase: false}).click();

        cy.contains('Add').click()

        cy.get('input[name="followup[0].en"]').type('C1 followup 1')
        cy.get('input[name="followup[0].se"]').type('C1_SE followup 1')

        cy.contains('Add').click()
        
        cy.get('input[name="followup[1].en"]').type('C1 followup 2')
        cy.get('input[name="followup[1].se"]').type('C1_SE followup 2')

        cy.contains('Add').click()
        
        cy.get('input[name="followup[2].en"]').type('C1 followup 3')
        cy.get('input[name="followup[2].se"]').type('C1_SE followup 3')

        cy.get('a[role="tab"]').contains('Rules', { matchCase: false}).click();

        //Rule 1
        cy.get('input[name="rules[0].name.se"]').type("Unsatisfactory_SE")

        cy.get('[class~="ra-input-rules[0].steps[0].en"] [data-testid="quill"]').type('Unsatisfactory Step 1')
        cy.get('[class~="ra-input-rules[0].steps[0].se"] [data-testid="quill"]').type('Unsatisfactory_SE Step 1')
        cy.get('[class~="ra-input-rules[0].steps[1].en"] [data-testid="quill"]').type('Unsatisfactory Step 2')
        cy.get('[class~="ra-input-rules[0].steps[1].se"] [data-testid="quill"]').type('Unsatisfactory_SE Step 2')
        cy.get('[class~="ra-input-rules[0].steps[2].en"] [data-testid="quill"]').type('Unsatisfactory Step 3')
        cy.get('[class~="ra-input-rules[0].steps[2].se"] [data-testid="quill"]').type('Unsatisfactory_SE Step 3')

        //Rule 2
        cy.get('input[name="rules[1].name.se"]').type("Fair_SE")

        //Rule 3
        cy.get('input[name="rules[2].name.se"]').type("Good_SE")

        cy.get('[class~="ra-input-rules[2].steps[0].en"] [data-testid="quill"]').type('Good Step 1')
        cy.get('[class~="ra-input-rules[2].steps[0].se"] [data-testid="quill"]').type('Good_SE Step 1')
        cy.get('[class~="ra-input-rules[2].steps[1].en"] [data-testid="quill"]').type('Good Step 2')
        cy.get('[class~="ra-input-rules[2].steps[1].se"] [data-testid="quill"]').type('Good_SE Step 2')
        cy.get('[class~="ra-input-rules[2].steps[2].en"] [data-testid="quill"]').type('Good Step 3')
        cy.get('[class~="ra-input-rules[2].steps[2].se"] [data-testid="quill"]').type('Good_SE Step 3')

        //Rule 4
        cy.get('input[name="rules[3].name.se"]').type("Great_SE")

        //Rule 5
        cy.get('input[name="rules[4].name.se"]').type("Excellent_SE")

        cy.get('[class~="ra-input-rules[4].steps[0].en"] [data-testid="quill"]').type('Excellent Step 1')
        cy.get('[class~="ra-input-rules[4].steps[0].se"] [data-testid="quill"]').type('Excellent_SE Step 1')
        cy.get('[class~="ra-input-rules[4].steps[1].en"] [data-testid="quill"]').type('Excellent Step 2')
        cy.get('[class~="ra-input-rules[4].steps[1].se"] [data-testid="quill"]').type('Excellent_SE Step 2')
        cy.get('[class~="ra-input-rules[4].steps[2].en"] [data-testid="quill"]').type('Excellent Step 3')
        cy.get('[class~="ra-input-rules[4].steps[2].se"] [data-testid="quill"]').type('Excellent_SE Step 3')

        cy.contains('Save').wait(1000).click()

        cy.get('table tbody tr')
          .first()
          .within(() => {
            cy.get('td').eq(1).should('contain', 'Are you familiar with C1?')
            cy.get('td').eq(2).should('contain', 'Evaluation')
            cy.get('td').eq(3).should('contain', 'Competency')
            cy.get('td').eq(4).should('contain', 'Woodkid & Co')
            cy.get('td').eq(5).should('contain', '3')
            cy.get('td').eq(6).should('contain', 'C1')
          })

        cy.visit('/questions/')

        cy.get('table tbody tr').first()
          .should('contain', 'Are you familiar with C1?')
          .should('contain', 'Competency')
          .should('contain', 'C1 followup 1')
          .should('contain', 'C1 followup 2')
          .should('contain', 'C1 followup 3')


        cy.changeLanguage('SE')


        cy.get('table tbody tr').first()
          .should('contain', 'Are you familiar with C1_SE?')
          .should('contain', 'C1_SE followup 1')
          .should('contain', 'C1_SE followup 2')
          .should('contain', 'C1_SE followup 3')
          .listRowNavigate('Edit')

        cy.get('[data-test-id="criteria-option"]')
          .should('contain', 'C1_SE')
          .should('contain', 'C1C1C1_SE')
          .find('[data-test-id="edit-button"]').click()
          .wait(1000)

        cy.document().its('body')
          .find('#criteria-option-modal')
          .should('contain', 'Criteria option')
          .within(() => {
            cy.get('input[name="name.se"]').should('have.value', 'C1_SE')
            cy.get('[contenteditable="true"]').should('contain', 'C1C1C1_SE')
        })
        .trigger('keyup', { code: "Escape" })

        cy.get('input[name="name.se"]').should('have.value', 'Are you familiar with C1_SE?');

        cy.get('[data-test-id="html-input-field"]#note').should('contain', 'C1note_SE')

        cy.contains('Unsatisfactory_SE').closest('ul')
          .within(() => {
            cy.get('li').eq(1).should('contain', 'Unsatisfactory_SE Step 1')
            cy.get('li').eq(2).should('contain', 'Unsatisfactory_SE Step 2')
            cy.get('li').eq(3).should('contain', 'Unsatisfactory_SE Step 3')
          })
          .closest('li')
          .next()
          .should('contain', 'Fair_SE')

        cy.contains('Good_SE').closest('ul')
          .within(() => {
            cy.get('li').eq(1).should('contain', 'Good_SE Step 1')
            cy.get('li').eq(2).should('contain', 'Good_SE Step 2')
            cy.get('li').eq(3).should('contain', 'Good_SE Step 3')
          })
          .closest('li')
          .next()
          .should('contain', 'Great_SE')

        cy.contains('Excellent_SE').closest('ul')
          .within(() => {
            cy.get('li').eq(1).should('contain', 'Excellent_SE Step 1')
            cy.get('li').eq(2).should('contain', 'Excellent_SE Step 2')
            cy.get('li').eq(3).should('contain', 'Excellent_SE Step 3')
          })

       cy.createDummyProject('Project C1')

       cy.contains('Project C1').closest('li').listRowNavigate('Edit')

       cy.addStage('Competency')
        .wait(1000)

        cy.get('[data-test-id="feature-form"]')
        .within(() => {
          cy.contains('Are you familiar with C1_SE?')
            .closest('li')
            .find('button[data-test-id="add-question"]').first().click()
        })

        cy.saveProject()

       cy.contains('Project C1').closest('li').click()

       cy.addProjectCandidate('Tom', 'tom@foobar.net')

       cy.contains('Start interview').click()

       cy.get('#language-choose-modal').find('button').contains('Choose').click()

       cy.get('[data-test-id="feature-form"]').eq(1)
        .should('contain', 'C1_SE')
        .should('contain', 'Are you familiar with C1_SE?')
        .should('contain', 'C1note_SE')
        .find('[data-test-id="question-score-board"]')
        .within(() => {
          cy.root().children().eq(0)
            .should('contain', 'Unsatisfactory_SE')
            .find('li').first()
            .should('contain', 'Unsatisfactory_SE Step 1').next()
            .should('contain', 'Unsatisfactory_SE Step 2').next()
            .should('contain', 'Unsatisfactory_SE Step 3')

          cy.root().children().eq(1)
            .should('contain', 'Fair_SE')

          cy.root().children().eq(2)
            .should('contain', 'Good_SE')
            .find('li').first()
            .should('contain', 'Good_SE Step 1').next()
            .should('contain', 'Good_SE Step 2').next()
            .should('contain', 'Good_SE Step 3')

          cy.root().children().eq(3)
            .should('contain', 'Great_SE')

          cy.root().children().eq(4)
            .should('contain', 'Excellent_SE')
            .find('li').first()
            .should('contain', 'Excellent_SE Step 1').next()
            .should('contain', 'Excellent_SE Step 2').next()
            .should('contain', 'Excellent_SE Step 3')
        })
        .contains('Great_SE').click()

       cy.contains('Complete interview').click();

       cy.location('pathname').should('contain', '/overview/')
       
       cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
         .should('contain', '75%')
    })


    it('Should create hard skill question', () => {
      cy.visit('/admin/#/criteriaOptions/create')
  
      cy.get('#react-admin-title').should('contain', 'Create Criterias');
  
      cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();
  
      cy.get('[id="translatable-content-en"]').within(() => {
        cy.get('input[name="name.en"]').type('HS1')
        cy.get('[data-testid="quill"]').type('HS1HS1HS1')
      })
  
      cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();
  
      cy.get('[id="translatable-content-se"]').within(() => {
        cy.get('input[name="name.se"]').type('HS1_SE')
        cy.get('[data-testid="quill"]').type('HS1HS1HS1_SE')
      })
  
      cy.get('.MuiSelect-root#type').click()
      cy.get('#menu-type').contains('Hard skill').click()
  
      cy.get('.MuiSelect-root#companyId').click()
      cy.get('#menu-companyId').contains('Woodkid & Co').click()
  
      cy.contains('Save').click()
  
      cy.get('table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(1).should('contain', 'HS1')
          cy.get('td').eq(2).should('contain', 'Hard skill')
          cy.get('td').eq(3).should('contain', 'Woodkid & Co')
        })
  
      cy.visit('/admin/#/questions/create')
  
      cy.get('.MuiSelect-root#companyId').click()
      cy.get('#menu-companyId').contains('Woodkid & Co').click()
  
      cy.get('.MuiSelect-root#type').click()
      cy.get('#menu-type').contains('Evaluation').click()
  
      cy.get('.MuiSelect-root#subtype').click()
      cy.get('#menu-subtype').contains('Hard skill').click()
  
      cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();
  
      cy.get('[id="translatable-content-en"]').within(() => {
        cy.get('input[name="name.en"]').type('Are you familiar with HS1?')
  
        cy.contains('Description').closest('div').find('[data-testid="quill"]').type('HS1desc')
        cy.contains('Note').closest('div').find('[data-testid="quill"]').type('HS1note')
      })
  
      cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();
  
      cy.get('[id="translatable-content-se"]').within(() => {
        cy.get('input[name="name.se"]').type('Are you familiar with HS1_SE?')
  
        cy.contains('Description').closest('div').find('[data-testid="quill"]').type('HS1desc_SE')
        cy.contains('Note').closest('div').find('[data-testid="quill"]').type('HS1note_SE')
      })
  
      cy.get('a[role="tab"]').contains('Criteria', { matchCase: false}).click();
  
      cy.get('.MuiSelect-root#criteriaId').click()
      cy.get('#menu-criteriaId').contains('HS1').first().click()
  
      cy.get('a[role="tab"]').contains('Follow-up', { matchCase: false}).click();
  
      cy.contains('Add').click()
  
      cy.get('input[name="followup[0].en"]').type('HS1 followup 1')
      cy.get('input[name="followup[0].se"]').type('HS1_SE followup 1')
  
      cy.contains('Add').click()
      
      cy.get('input[name="followup[1].en"]').type('HS1 followup 2')
      cy.get('input[name="followup[1].se"]').type('HS1_SE followup 2')
  
      cy.contains('Add').click()
      
      cy.get('input[name="followup[2].en"]').type('HS1 followup 3')
      cy.get('input[name="followup[2].se"]').type('HS1_SE followup 3')
  
      cy.get('a[role="tab"]').contains('Rules', { matchCase: false}).click();
  
      //Rule 1
      cy.get('input[name="rules[0].name.se"]').type("Novice_SE")
      cy.get('[class~="ra-input-rules[0].steps[0].se"] [data-testid="quill"]').type('Novice_SE Step 1')
  
      //Rule 2
      cy.get('input[name="rules[1].name.se"]').type("Beginner_SE")
      cy.get('[class~="ra-input-rules[1].steps[0].se"] [data-testid="quill"]').type('Beginner_SE Step 1')
  
      //Rule 3
      cy.get('input[name="rules[2].name.se"]').type("Competent_SE")
      cy.get('[class~="ra-input-rules[2].steps[0].se"] [data-testid="quill"]').type('Competent_SE Step 1')
  
      //Rule 4
      cy.get('input[name="rules[3].name.se"]').type("Proficient_SE")
      cy.get('[class~="ra-input-rules[3].steps[0].se"] [data-testid="quill"]').type('Proficient_SE Step 1')
  
      //Rule 5
      cy.get('input[name="rules[4].name.se"]').type("Master_SE")
      cy.get('[class~="ra-input-rules[4].steps[0].se"] [data-testid="quill"]').type('Master_SE Step 1')
  
      cy.contains('Save').wait(1000).click()
  
      cy.get('table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(1).should('contain', 'Are you familiar with HS1?')
          cy.get('td').eq(2).should('contain', 'Evaluation')
          cy.get('td').eq(3).should('contain', 'Hard skill')
          cy.get('td').eq(4).should('contain', 'Woodkid & Co')
          cy.get('td').eq(5).should('contain', '3')
          cy.get('td').eq(6).should('contain', 'HS1')
        })
  
      cy.visit('/questions/')
  
      cy.get('table tbody tr').first()
        .should('contain', 'Are you familiar with HS1?')
        .should('contain', 'Hard skill')
        .should('contain', 'HS1 followup 1')
        .should('contain', 'HS1 followup 2')
        .should('contain', 'HS1 followup 3')
  
  
      cy.changeLanguage('SE')
  
      cy.get('table tbody tr').first()
        .should('contain', 'Are you familiar with HS1_SE?')
        .should('contain', 'HS1_SE followup 1')
        .should('contain', 'HS1_SE followup 2')
        .should('contain', 'HS1_SE followup 3')
        .listRowNavigate('Edit')
  
      cy.get('[data-test-id="criteria-option"]')
        .should('contain', 'HS1_SE')
        .should('contain', 'HS1HS1HS1_SE')
        .find('[data-test-id="edit-button"]').click()
        .wait(1000)
  
      cy.document().its('body')
        .find('#criteria-option-modal')
        .should('contain', 'Criteria option')
        .within(() => {
          cy.get('input[name="name.se"]').should('have.value', 'HS1_SE')
      })
      .trigger('keyup', { code: "Escape" })
  
      cy.get('input[name="name.se"]').should('have.value', 'Are you familiar with HS1_SE?');
  
      cy.get('[data-test-id="html-input-field"]#note').should('contain', 'HS1note_SE')
  
      cy.contains('Novice_SE').closest('ul')
        .within(() => {
          cy.get('li').eq(1).should('contain', 'Novice_SE Step 1')
        })

      cy.contains('Beginner_SE').closest('ul')
        .within(() => {
          cy.get('li').eq(1).should('contain', 'Beginner_SE Step 1')
        })
  
      cy.contains('Competent_SE').closest('ul')
        .within(() => {
          cy.get('li').eq(1).should('contain', 'Competent_SE Step 1')
        })
      
      cy.contains('Proficient_SE').closest('ul')
        .within(() => {
          cy.get('li').eq(1).should('contain', 'Proficient_SE Step 1')
        })
  
      cy.contains('Master_SE').closest('ul')
        .within(() => {
          cy.get('li').eq(1).should('contain', 'Master_SE Step 1')
        })
  
     cy.createDummyProject('Project HS1')
  
     cy.contains('Project HS1').closest('li').listRowNavigate('Edit')
  
     cy.addStage('Hard skill')
  
      cy.get('[data-test-id="feature-form"]')
      .within(() => {
        cy.contains('Are you familiar with HS1_SE?').closest('li').find('button').click()
      })
  
      cy.saveProject()
  
     cy.contains('Project HS1').closest('li').click()
  
     cy.addProjectCandidate('Tom', 'tom@foobar.net')
  
     cy.contains('Start interview').click()

     cy.get('#language-choose-modal').find('button').contains('Choose').click()
  
     cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'HS1_SE')
      .should('contain', 'Are you familiar with HS1_SE?')
      .should('contain', 'HS1note_SE')
      .find('[data-test-id="question-score-board"]')
      .within(() => {
        cy.root().children().eq(0)
          .should('contain', 'Novice_SE')
          .find('li').first()
          .should('contain', 'Novice_SE Step 1')
  
        cy.root().children().eq(1)
          .should('contain', 'Beginner_SE')
          .find('li').first()
          .should('contain', 'Beginner_SE Step 1')
  
        cy.root().children().eq(2)
          .should('contain', 'Competent_SE')
          .find('li').first()
          .should('contain', 'Competent_SE Step 1')
  
        cy.root().children().eq(3)
          .should('contain', 'Proficient_SE')
          .find('li').first()
          .should('contain', 'Proficient_SE Step 1')

        cy.root().children().eq(4)
          .should('contain', 'Master_SE')
          .find('li').first()
          .should('contain', 'Master_SE Step 1')
      })
      .contains('Master_SE').click()
  
     cy.contains('Complete interview').click();
  
     cy.location('pathname').should('contain', '/overview/')
     
     cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
       .should('contain', '100%')
  })

  it('Should create experience question', () => {
    cy.visit('/admin/#/criteriaOptions/create')

    cy.get('#react-admin-title').should('contain', 'Create Criterias');

    cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();

    cy.get('[id="translatable-content-en"]').within(() => {
      cy.get('input[name="name.en"]').type('E1')
      cy.get('[data-testid="quill"]').type('E1E1E1')
    })

    cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();

    cy.get('[id="translatable-content-se"]').within(() => {
      cy.get('input[name="name.se"]').type('E1_SE')
      cy.get('[data-testid="quill"]').type('E1E1E1_SE')
    })

    cy.get('.MuiSelect-root#type').click()
    cy.get('#menu-type').contains('Experience').click()

    cy.get('.MuiSelect-root#companyId').click()
    cy.get('#menu-companyId').contains('Woodkid & Co').click()

    cy.contains('Save').click()

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(1).should('contain', 'E1')
        cy.get('td').eq(2).should('contain', 'Experience')
        cy.get('td').eq(3).should('contain', 'Woodkid & Co')
      })

    cy.visit('/admin/#/questions/create')

    cy.get('.MuiSelect-root#companyId').click()
    cy.get('#menu-companyId').contains('Woodkid & Co').click()

    cy.get('.MuiSelect-root#type').click()
    cy.get('#menu-type').contains('Evaluation').click()

    cy.get('.MuiSelect-root#subtype').click()
    cy.get('#menu-subtype').contains('Experience').click()

    cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();

    cy.get('[id="translatable-content-en"]').within(() => {
      cy.get('input[name="name.en"]').type('Are you familiar with E1?')

      cy.contains('Description').closest('div').find('[data-testid="quill"]').type('E1desc')
      cy.contains('Note').closest('div').find('[data-testid="quill"]').type('E1note')
    })

    cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();

    cy.get('[id="translatable-content-se"]').within(() => {
      cy.get('input[name="name.se"]').type('Are you familiar with E1_SE?')

      cy.contains('Description').closest('div').find('[data-testid="quill"]').type('E1desc_SE')
      cy.contains('Note').closest('div').find('[data-testid="quill"]').type('E1note_SE')
    })

    cy.get('a[role="tab"]').contains('Criteria', { matchCase: false}).click();

    cy.get('.MuiSelect-root#criteriaId').click()
    cy.get('#menu-criteriaId').contains('E1').first().click()

    cy.get('a[role="tab"]').contains('Follow-up', { matchCase: false}).click();

    cy.contains('Add').click()

    cy.get('input[name="followup[0].en"]').type('E1 followup 1')
    cy.get('input[name="followup[0].se"]').type('E1_SE followup 1')

    cy.contains('Add').click()
    
    cy.get('input[name="followup[1].en"]').type('E1 followup 2')
    cy.get('input[name="followup[1].se"]').type('E1_SE followup 2')

    cy.contains('Add').click()
    
    cy.get('input[name="followup[2].en"]').type('E1 followup 3')
    cy.get('input[name="followup[2].se"]').type('E1_SE followup 3')

    cy.get('a[role="tab"]').contains('Rules', { matchCase: false}).click();

    //Rules
    cy.get('input[name="rules[0].name.se"]').type("No experience_SE")
    cy.get('input[name="rules[1].name.se"]').type("Little experience_SE")
    cy.get('input[name="rules[2].name.se"]').type("Experienced_SE")
    cy.get('input[name="rules[3].name.se"]').type("Very experienced_SE")
    cy.get('input[name="rules[4].name.se"]').type("Extensively experienced_SE")

    cy.contains('Save').wait(1000).click()

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(1).should('contain', 'Are you familiar with E1?')
        cy.get('td').eq(2).should('contain', 'Evaluation')
        cy.get('td').eq(3).should('contain', 'Experience')
        cy.get('td').eq(4).should('contain', 'Woodkid & Co')
        cy.get('td').eq(5).should('contain', '3')
        cy.get('td').eq(6).should('contain', 'E1')
      })

    cy.visit('/questions/')

    cy.get('table tbody tr').first()
      .should('contain', 'Are you familiar with E1?')
      .should('contain', 'Experience')
      .should('contain', 'E1 followup 1')
      .should('contain', 'E1 followup 2')
      .should('contain', 'E1 followup 3')


    cy.changeLanguage('SE')

    cy.get('table tbody tr').first()
      .should('contain', 'Are you familiar with E1_SE?')
      .should('contain', 'E1_SE followup 1')
      .should('contain', 'E1_SE followup 2')
      .should('contain', 'E1_SE followup 3')
      .listRowNavigate('Edit')

    cy.get('[data-test-id="criteria-option"]')
      .should('contain', 'E1_SE')
      .should('contain', 'E1E1E1_SE')
      .find('[data-test-id="edit-button"]').click()
      .wait(1000)

    cy.document().its('body')
      .find('#criteria-option-modal')
      .should('contain', 'Criteria option')
      .within(() => {
        cy.get('input[name="name.se"]').should('have.value', 'E1_SE')
    })
    .trigger('keyup', { code: "Escape" })

    cy.get('input[name="name.se"]').should('have.value', 'Are you familiar with E1_SE?');

    cy.get('[data-test-id="html-input-field"]#note').should('contain', 'E1note_SE')


    cy.get('[data-test-id="question-score-input-field"] > ul > li')
      .first().should('contain', 'No experience_SE')
      .next().should('contain', 'Little experience_SE')
      .next().should('contain', 'Experienced_SE')
      .next().should('contain', 'Very experienced_SE')
      .next().should('contain', 'Extensively experienced_SE')

  cy.createDummyProject('Project E1')

   cy.contains('Project E1').closest('li').listRowNavigate('Edit')

   cy.addStage('Experience')

    cy.get('[data-test-id="feature-form"]')
    .within(() => {
      cy.contains('Are you familiar with E1_SE?')
        .closest('li')
        .find('button').first().click()
    })
    .wait(1000)

    cy.get('[data-test-id="project-evaluation-criteria"]')
      .within(() => {
        cy.contains('Experience').parent().should('contain', '100%')
          .parent()
          .find('ul').within(() => {
            cy.get('li').eq(0).should('contain', 'E1_SE').should('contain', '100%')
          })
      })
      .find('[data-test-id="edit-button"]')
      .click()


    cy.get('#scoring-rules-modal')
      .should('contain', 'Project scoring rules')
      .within(() => {
        cy.contains('E1_SE').closest('tr').find('input').should('have.value', 100)
      })
      .trigger('keyup', { code: "Escape" })

    cy.saveProject()

   cy.contains('Project E1').closest('li').click()

   cy.addProjectCandidate('Tom', 'tom@foobar.net')

   cy.contains('Start interview').click()

   cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.processOverviewConfirmQuestioncount(1)
    cy.processOverviewConfirmStageCount(2);
    cy.processOverviewConfirmStageStatus(1, 'E1_SE', 'Not started')

   cy.get('[data-test-id="feature-form"]').eq(1)
    .should('contain', 'E1_SE')
    .should('contain', 'Are you familiar with E1_SE?')
    .should('contain', 'E1note_SE')
    .find('[data-test-id="question-score-board"]')
    .within(() => {
      cy.root().children().eq(0)
        .should('contain', 'No experience_SE')

      cy.root().children().eq(1)
        .should('contain', 'Little experience_SE')

      cy.root().children().eq(2)
        .should('contain', 'Experienced_SE')

      cy.root().children().eq(3)
        .should('contain', 'Very experienced_SE')
        
      cy.root().children().eq(4)
        .should('contain', 'Extensively experienced_SE')
    })
    .contains('Extensively experienced_SE').click()

   cy.contains('Complete interview').click();

   cy.location('pathname').should('contain', '/overview/')
   
   cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
     .should('contain', '100%')
})

it('Should create motivation question', () => {
  cy.visit('/admin/#/questions/create')
  
  cy.get('.MuiSelect-root#companyId').click()
  cy.get('#menu-companyId').contains('Woodkid & Co').click()
  
  cy.get('.MuiSelect-root#type').click()
  cy.get('#menu-type').contains('Evaluation').click()
  
  cy.get('.MuiSelect-root#subtype').click()
  cy.get('#menu-subtype').contains('Motivation').click()
  
  cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();
  
  cy.get('[id="translatable-content-en"]').within(() => {
      cy.get('input[name="name.en"]').type('Are you familiar with M1?')
  
      cy.contains('Description').closest('div').find('[data-testid="quill"]').type('M1desc')
      cy.contains('Note').closest('div').find('[data-testid="quill"]').type('M1note')
  })
  
  cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();
  
  cy.get('[id="translatable-content-se"]').within(() => {
      cy.get('input[name="name.se"]').type('Are you familiar with M1_SE?')
  
      cy.contains('Description').closest('div').find('[data-testid="quill"]').type('M1desc_SE')
      cy.contains('Note').closest('div').find('[data-testid="quill"]').type('M1note_SE')
  })
  
  cy.get('a[role="tab"]').contains('Follow-up', { matchCase: false}).click();
  
  cy.contains('Add').click()
  
  cy.get('input[name="followup[0].en"]').type('M1 followup 1')
  cy.get('input[name="followup[0].se"]').type('M1_SE followup 1')
  
  cy.contains('Add').click()
  
  cy.get('input[name="followup[1].en"]').type('M1 followup 2')
  cy.get('input[name="followup[1].se"]').type('M1_SE followup 2')
  
  cy.contains('Add').click()
  
  cy.get('input[name="followup[2].en"]').type('M1 followup 3')
  cy.get('input[name="followup[2].se"]').type('M1_SE followup 3')
  
  cy.get('a[role="tab"]').contains('Rules', { matchCase: false}).click();
  
  //Rules
  cy.get('input[name="rules[0].name.se"]').type("Not motivated_SE")
  cy.get('input[name="rules[1].name.se"]').type("Slightly motivated_SE")
  cy.get('input[name="rules[2].name.se"]').type("Motivated_SE")
  cy.get('input[name="rules[3].name.se"]').type("Highly motivated_SE")
  cy.get('input[name="rules[4].name.se"]').type("Extremely motivated_SE")
  
  cy.contains('Save').wait(1000).click()
  
  cy.get('table tbody tr')
      .first()
      .within(() => {
      cy.get('td').eq(1).should('contain', 'Are you familiar with M1?')
      cy.get('td').eq(2).should('contain', 'Evaluation')
      cy.get('td').eq(3).should('contain', 'Motivation')
      cy.get('td').eq(4).should('contain', 'Woodkid & Co')
      cy.get('td').eq(5).should('contain', '3')
      })
  
  cy.visit('/questions/')
  
  cy.get('table tbody tr').first()
      .should('contain', 'Are you familiar with M1?')
      .should('contain', 'Motivation')
      .should('contain', 'M1 followup 1')
      .should('contain', 'M1 followup 2')
      .should('contain', 'M1 followup 3')
  
  
  cy.changeLanguage('SE')
  
  cy.get('table tbody tr').first()
      .should('contain', 'Are you familiar with M1_SE?')
      .should('contain', 'M1_SE followup 1')
      .should('contain', 'M1_SE followup 2')
      .should('contain', 'M1_SE followup 3')
      .listRowNavigate('Edit')
  
  cy.get('input[name="name.se"]').should('have.value', 'Are you familiar with M1_SE?');
  
  cy.get('[data-test-id="html-input-field"]#note').should('contain', 'M1note_SE')
  
  
  cy.get('[data-test-id="question-score-input-field"] > ul > li')
      .first().should('contain', 'Not motivated_SE')
      .next().should('contain', 'Slightly motivated_SE')
      .next().should('contain', 'Motivated_SE')
      .next().should('contain', 'Highly motivated_SE')
      .next().should('contain', 'Extremely motivated_SE')
  
  cy.createDummyProject('Project M1')
  
  cy.contains('Project M1').closest('li').listRowNavigate('Edit')
  
  cy.addStage('Motivation')
  
  cy.get('[data-test-id="feature-form"]')
  .within(() => {
      cy.contains('Are you familiar with M1_SE?')
      .closest('li')
      .find('button').first().click()
  })
  .wait(1000)
  
  cy.get('[data-test-id="project-evaluation-criteria"]')
      .within(() => {
        cy.contains('Motivation').parent().should('contain', '100%')
      })
      .find('[data-test-id="edit-button"]')
      .click()
  
  
  cy.get('#scoring-rules-modal')
      .should('contain', 'Project scoring rules')
      .within(() => {
      cy.contains('Motivation').closest('tr').find('input').should('have.value', 100)
      })
      .trigger('keyup', { code: "Escape" })
  
  cy.saveProject()
  
  cy.contains('Project M1').closest('li').click()
  
  cy.addProjectCandidate('Tom', 'tom@foobar.net')
  
  cy.contains('Start interview').click()

  cy.get('#language-choose-modal').find('button').contains('Choose').click()
  
  cy.processOverviewConfirmQuestioncount(1)
  cy.processOverviewConfirmStageCount(2);
  cy.processOverviewConfirmStageStatus(1, 'Motivation', 'Not started')
  
  cy.get('[data-test-id="feature-form"]').eq(1)
  .should('contain', 'M1_SE')
  .should('contain', 'Are you familiar with M1_SE?')
  .should('contain', 'M1note_SE')
  .find('[data-test-id="question-score-board"]')
  .within(() => {
      cy.root().children().eq(0)
      .should('contain', 'Not motivated_SE')
  
      cy.root().children().eq(1)
      .should('contain', 'Slightly motivated_SE')
  
      cy.root().children().eq(2)
      .should('contain', 'Motivated_SE')
  
      cy.root().children().eq(3)
      .should('contain', 'Highly motivated_SE')
      
      cy.root().children().eq(4)
      .should('contain', 'Extremely motivated_SE')
  })
  .contains('Extremely motivated_SE').click()
  
  cy.contains('Complete interview').click();
  
  cy.location('pathname').should('contain', '/overview/')
  
  cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
      .should('contain', '100%')
})
 
it('Should create culture question', () => {
    cy.visit('/admin/#/questions/create')
    
    cy.get('.MuiSelect-root#companyId').click()
    cy.get('#menu-companyId').contains('Woodkid & Co').click()
    
    cy.get('.MuiSelect-root#type').click()
    cy.get('#menu-type').contains('Evaluation').click()
    
    cy.get('.MuiSelect-root#subtype').click()
    cy.get('#menu-subtype').contains('Culture').click()
    
    cy.get('button[role="tab"]').contains('EN', { matchCase: false}).click();
    
    cy.get('[id="translatable-content-en"]').within(() => {
        cy.get('input[name="name.en"]').type('Are you familiar with C1?')
    
        cy.contains('Description').closest('div').find('[data-testid="quill"]').type('C1desc')
        cy.contains('Note').closest('div').find('[data-testid="quill"]').type('C1note')
    })
    
    cy.get('button[role="tab"]').contains('SE', { matchCase: false}).click();
    
    cy.get('[id="translatable-content-se"]').within(() => {
        cy.get('input[name="name.se"]').type('Are you familiar with C1_SE?')
    
        cy.contains('Description').closest('div').find('[data-testid="quill"]').type('C1desc_SE')
        cy.contains('Note').closest('div').find('[data-testid="quill"]').type('C1note_SE')
    })
    
    cy.get('a[role="tab"]').contains('Follow-up', { matchCase: false}).click();
    
    cy.contains('Add').click()
    
    cy.get('input[name="followup[0].en"]').type('C1 followup 1')
    cy.get('input[name="followup[0].se"]').type('C1_SE followup 1')
    
    cy.contains('Add').click()
    
    cy.get('input[name="followup[1].en"]').type('C1 followup 2')
    cy.get('input[name="followup[1].se"]').type('C1_SE followup 2')
    
    cy.contains('Add').click()
    
    cy.get('input[name="followup[2].en"]').type('C1 followup 3')
    cy.get('input[name="followup[2].se"]').type('C1_SE followup 3')
    
    cy.get('a[role="tab"]').contains('Rules', { matchCase: false}).click();
    
    //Rules
    cy.get('input[name="rules[0].name.se"]').type("Very low fit_SE")
    cy.get('input[name="rules[1].name.se"]').type("Low fit_SE")
    cy.get('input[name="rules[2].name.se"]').type("Average fit_SE")
    cy.get('input[name="rules[3].name.se"]').type("High fit_SE")
    cy.get('input[name="rules[4].name.se"]').type("Very high fit_SE")
    
    cy.contains('Save').wait(1000).click()
    
    cy.get('table tbody tr')
        .first()
        .within(() => {
        cy.get('td').eq(1).should('contain', 'Are you familiar with C1?')
        cy.get('td').eq(2).should('contain', 'Evaluation')
        cy.get('td').eq(3).should('contain', 'Culture')
        cy.get('td').eq(4).should('contain', 'Woodkid & Co')
        cy.get('td').eq(5).should('contain', '3')
        })
    
    cy.visit('/questions/')
    
    cy.get('table tbody tr').first()
        .should('contain', 'Are you familiar with C1?')
        .should('contain', 'Culture')
        .should('contain', 'C1 followup 1')
        .should('contain', 'C1 followup 2')
        .should('contain', 'C1 followup 3')
    
    
    cy.changeLanguage('SE')
    
    cy.get('table tbody tr').first()
        .should('contain', 'Are you familiar with C1_SE?')
        .should('contain', 'C1_SE followup 1')
        .should('contain', 'C1_SE followup 2')
        .should('contain', 'C1_SE followup 3')
        .listRowNavigate('Edit')
    
    cy.get('input[name="name.se"]').should('have.value', 'Are you familiar with C1_SE?');
    
    cy.get('[data-test-id="html-input-field"]#note').should('contain', 'C1note_SE')
    
    
    cy.get('[data-test-id="question-score-input-field"] > ul > li')
        .first().should('contain', 'Very low fit_SE')
        .next().should('contain', 'Low fit_SE')
        .next().should('contain', 'Average fit_SE')
        .next().should('contain', 'High fit_SE')
        .next().should('contain', 'Very high fit_SE')
    
    cy.createDummyProject('Project C1')
    
    cy.contains('Project C1').closest('li').listRowNavigate('Edit')
    

    cy.addStage('Culture')

    
    cy.get('[data-test-id="feature-form"]')
    .within(() => {
        cy.contains('Are you familiar with C1_SE?')
        .closest('li')
        .find('button').first().click()
    })
    .wait(1000)
    
    cy.get('[data-test-id="project-evaluation-criteria"]')
        .within(() => {
          cy.contains('Culture').parent().should('contain', '100%')
        })
        .find('[data-test-id="edit-button"]')
        .click()
    
    
    cy.get('#scoring-rules-modal')
        .should('contain', 'Project scoring rules')
        .within(() => {
        cy.contains('Culture').closest('tr').find('input').should('have.value', 100)
        })
        .trigger('keyup', { code: "Escape" })
    
    cy.saveProject()
    
    cy.contains('Project C1').closest('li').click()
    
    cy.addProjectCandidate('Tom', 'tom@foobar.net')
    
    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()
    
    cy.processOverviewConfirmQuestioncount(1)
    cy.processOverviewConfirmStageCount(2);
    cy.processOverviewConfirmStageStatus(1, 'Culture', 'Not started')
    
    cy.get('[data-test-id="feature-form"]').eq(1)
    .should('contain', 'C1_SE')
    .should('contain', 'Are you familiar with C1_SE?')
    .should('contain', 'C1note_SE')
    .find('[data-test-id="question-score-board"]')
    .within(() => {
        cy.root().children().eq(0)
        .should('contain', 'Very low fit_SE')
    
        cy.root().children().eq(1)
        .should('contain', 'Low fit_SE')
    
        cy.root().children().eq(2)
        .should('contain', 'Average fit_SE')
    
        cy.root().children().eq(3)
        .should('contain', 'High fit_SE')
        
        cy.root().children().eq(4)
        .should('contain', 'Very high fit_SE')
    })
    .contains('Very high fit_SE').click()
    
    cy.contains('Complete interview').click();
    
    cy.location('pathname').should('contain', '/overview/')
    
    cy.contains('Tom').first().closest('[data-test-id="flex-table-row"]')
        .should('contain', '100%')
  })
})