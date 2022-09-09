describe('Backoffice company stats', () => {
    beforeEach(() => {
      cy.login('joe.pink@example.com', 'test123');
    })

    it('Should create competency question', () => {
        // 1 Question
        cy.createCompetencyQuestion({
            name: 'Are you familiar with CQ1?',
            criteria: {
                name: 'CA',
                create: true
            }
        })

        // 2 Projects
        cy.createDummyProject('Just some project 1')
        cy.createDummyProject('Just some project 2')

        // 3 Templates
        cy.createDummyTemplate('Just some template 1')
        cy.createDummyTemplate('Just some template 2')
        cy.createDummyTemplate('Just some template 3')

        cy.visit('/projects/')

        cy.contains('Just some project 1')
          .closest('li')
          .listRowNavigate('Edit')

        cy.addStage('Competency')

          cy.get('[data-test-id="feature-form"]')
          .within(() => {
            cy.contains('Are you familiar with CQ1?').closest('li').find('button').click()
          })

        cy.contains('Save project').click()

        cy.get('[data-test-id="alert-success"]').should('contain', 'Project saved')

        cy.contains('Just some project 1').closest('li').listRowNavigate('Interviews')

        // 4 Candidates
        cy.addProjectCandidate('Candidate 1', 'c1@example.com')
        cy.addProjectCandidate('Candidate 2', 'c2@example.com')
        cy.addProjectCandidate('Candidate 3', 'c3@example.com')
        cy.addProjectCandidate('Candidate 4', 'c4@example.com')

        cy.contains('Candidate 1')
          .closest('[data-test-id="flex-table-row"]')
          .contains('Start interview')
          .click();

        cy.contains('Are you familiar with CQ1?')
          .closest('[data-test-id="feature-form"]')
          .contains('Great')
          .click()

        cy.contains('Complete interview').click();

        cy.location('pathname').should('contain', '/overview/')

        cy.contains('Candidate 1').first().closest('[data-test-id="flex-table-row"]')
          .should('contain', '75%')

          cy.contains('Candidate 2')
          .closest('[data-test-id="flex-table-row"]')
          .contains('Start interview')
          .click();

        cy.contains('Are you familiar with CQ1?')
          .closest('[data-test-id="feature-form"]')
          .contains('Good')
          .click()

        cy.contains('Complete interview').click();

        cy.location('pathname').should('contain', '/overview/')

        cy.contains('Candidate 2').first().closest('[data-test-id="flex-table-row"]')
          .should('contain', '50%')

        cy.visit('/admin/#/companies')

        cy.get('table thead tr')
            .closest('tr')
            .within(() => {
                cy.get('th').eq(1).should('contain', 'Name')
                cy.get('th').eq(2).should('contain', 'Images')
                cy.get('th').eq(3).should('contain', 'Projects')
                cy.get('th').eq(4).should('contain', 'Stages (avg. pp.)')
                cy.get('th').eq(5).should('contain', 'Interviews (avg. pp.)')
                cy.get('th').eq(6).should('contain', 'Interviews complete')
                cy.get('th').eq(7).should('contain', 'Score (avg. %)')
                cy.get('th').eq(8).should('contain', 'Templates')
                cy.get('th').eq(9).should('contain', 'Questions')
                cy.get('th').eq(10).should('contain', 'Users')
            })

        cy.contains('Pink & Co')
          .closest('tr')
          .within(() => {
            cy.get('td').eq(1).should('contain', 'Pink & Co')
            cy.get('td').eq(3).should('contain', '2')
            cy.get('td').eq(4).should('contain', '2')
            cy.get('td').eq(5).should('contain', '2')
            cy.get('td').eq(6).should('contain', '50%')
            cy.get('td').eq(7).should('contain', '63%')
            cy.get('td').eq(8).should('contain', '3')
            cy.get('td').eq(9).should('contain', '1')
            cy.get('td').eq(10).should('contain', '2')
          })
    })
})
