const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc congue nisi vitae suscipit tellus mauris a diam.';
//@TODO https://www.npmjs.com/package/lorem-ipsum

describe('stages', () => {
    beforeEach(() => {
      cy.login('joe.johnson@example.com', 'test123')
    })

    it('introduction', () => {
      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Introduction', 10)

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '10m')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Introduction')
        .should('contain', '10m')
        .should('have.attr', 'data-error', '0')

      cy.saveProject(false)

      cy.get('[data-test-id="alert-error"]').contains('Some stages are invalid.')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('have.attr', 'data-error', 'Form invalid.')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Field required.')
        .findHtmlInputAndType(LOREM_IPSUM)
        .should('not.contain', 'Field required.')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('have.attr', 'data-error', '0')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Introduction'
        ])
        .should('contain', '10m')
        .listRowNavigate('Interviews')

      cy.addProjectCandidate('Tom', 'tom@foobar.net')

      cy.contains('Start interview').click()

      cy.get('#language-choose-modal').find('button').contains('Choose').click()

      cy.get('[data-test-id="feature-form"]').eq(0)
        .should('contain', 'Introduction')
        .should('contain', '10m')
        .should('contain', LOREM_IPSUM)

      cy.contains('Process overview')
        .closest('div[data-test-id="interview-process-overview"]')
        .within(() => {
          cy.contains('Questions').closest('div')
            .should('contain', 0)

          cy.get('ul')
            .within(() => {
              cy.get('li').eq(0)
                .should('contain', 'In progress')
                .should('contain', 'Introduction')
            })
          })
    })

    it('summary', () => {
      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Summary', 10)

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Summary')
        .should('contain', '10m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Summary')
        .should('contain', '10m')
        .should('not.contain', 'Field required.')

      cy.saveProject(false)

      cy.get('[data-test-id="alert-error"]').contains('Some stages are invalid.')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('have.attr', 'data-error', 'Form invalid.')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Field required.')
        .findHtmlInputAndType(LOREM_IPSUM)
        .should('not.contain', 'Field required.')

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '10m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Summary'
        ])
        .should('contain', '10m')
        .listRowNavigate('Interviews')

      cy.addProjectCandidate('Tom', 'tom@foobar.net')

      cy.contains('Start interview').click()

      cy.get('#language-choose-modal').find('button').contains('Choose').click()

      cy.get('[data-test-id="feature-form"]').eq(0)
        .should('contain', 'Summary')
        .should('contain', '10m')
        .should('contain', LOREM_IPSUM)

      cy.contains('Process overview')
        .closest('div[data-test-id="interview-process-overview"]')
        .within(() => {
          cy.contains('Questions').closest('div')
            .should('contain', 0)

          cy.get('ul')
            .within(() => {
              cy.get('li').eq(0)
                .should('contain', 'In progress')
                .should('contain', 'Summary')
            })
          })
    })

    it('company-presentation', () => {
      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Company', 10)

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Company')
        .should('contain', '10m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Company')
        .should('contain', '10m')
        .within(() => {
          cy.root().findHtmlInputAndType(LOREM_IPSUM)

          cy.get('table').should('not.exist')

          cy.get('[data-test-id="file-upload-area"]')
            .should('contain', 'Drag and Drop files here')
            .should('contain', 'Maximum file size: 1.0 MB')
            .should('contain', 'Max files per upload: 5')
            .should('contain', 'Allowed formats: .pdf, .pptx, .ppt, .docx, .xls, .jpg, .png, .jpeg, .gif')
            .find('input[type="file"]')
            .first()
            .attachFile('uploads/corporate-presentation.pdf')

          cy.wait(1000)

          cy.get('.form-error')
            .should('contain', 'Some files exceed maximum allowd file size - 1.0 MB.')

          cy.get('[data-test-id="file-upload-area"]')
            .find('input[type="file"]')
            .first()
            .attachFile(['uploads/info.pdf', 'uploads/office-500.jpg', 'uploads/File A.pdf', 'uploads/File B.pdf'])

          cy.get('.form-success').should('exist').should('contain', 'Files uploaded.')
          cy.get('.form-error').should('not.exist')

          cy.get('[data-test-id="file-upload-area"]')
          .find('input[type="file"]')
          .first()
          .attachFile(['uploads/info-plus.pdf'])

          cy.wait(1000)

          cy.get('.form-success').should('not.exist')
          cy.get('.form-error').should('exist').should('contain', 'Total upload size exceeds available storage space')

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
              cy.contains('office-500.jpg')
                .closest('tr')
                .within(() => {
                  cy.get('td').eq(0).find('img').should('exist');
                  cy.get('td').eq(1).find('a').should('contain', 'office-500.jpg');
                  cy.get('td').eq(2).should($td => {
                    expect($td.get(0).innerText).to.match(/^[\d\.]+\skB$/)
                  });
                  cy.get('td').eq(3).find('button[data-test-id="trash-button"]').should('exist');
                })


              cy.contains('info.pdf')
                .closest('tr')
                .within(() => {
                  cy.get('td').eq(0).find('img').should('not.exist');
                  cy.get('td').eq(1).find('a').should('contain', 'info.pdf');
                  cy.get('td').eq(2).should($td => {
                    expect($td.get(0).innerText).to.match(/^[\d\.]+\skB$/)
                  });
                  cy.get('td').eq(3).find('button[data-test-id="trash-button"]').should('exist');
                })

              cy.contains('File A.pdf')
                .closest('tr')
                .within(() => {
                  cy.get('td').eq(0).find('img').should('not.exist');
                  cy.get('td').eq(1).find('a').should('contain', 'File A.pdf');
                  cy.get('td').eq(2).should($td => {
                    expect($td.get(0).innerText).to.match(/^[\d\.]+\skB$/)
                  });
                  cy.get('td').eq(3).find('button[data-test-id="trash-button"]').should('exist')
                })

              cy.contains('File B.pdf')
                .closest('tr')
                .within(() => {
                  cy.get('td').eq(0).find('img').should('not.exist');
                  cy.get('td').eq(1).find('a').should('contain', 'File B.pdf');
                  cy.get('td').eq(2).should($td => {
                    expect($td.get(0).innerText).to.match(/^[\d\.]+\skB$/)
                  });
                  cy.get('td').eq(3).find('button[data-test-id="trash-button"]').should('exist').click()
                })

              cy.get('tr').should('have.length', 3).first().should('not.contain', 'File A.pdf')
            })

            cy.get('[data-test-id="file-upload-area"]')
              .find('input[type="file"]')
              .first()
              .attachFile('uploads/office.xyz')

            cy.get('.form-success').should('not.exist')
            cy.get('.form-error')
              .should('contain', 'Some files are not allowed for upload.')

            cy.get('[data-test-id="file-upload-area"]')
              .find('input[type="file"]')
              .first()
              .attachFile(['uploads/File A.pdf', 'uploads/File B.pdf', 'uploads/File C.pdf'])

            cy.get('.form-error')
              .should('contain', 'You are trying to upload 3 files, but you can only upload 2!')

            cy.get('[data-test-id="file-upload-area"]')
              .find('input[type="file"]')
              .first()
              .attachFile(['uploads/File B.pdf', 'uploads/File C.pdf'])

            cy.wait(1000)

            cy.get('table tbody tr').should('have.length', 5)
            cy.get('[data-test-id="file-upload-area"]').should('not.exist')
        })
        .should('contain', 'You have reached file upload limit.')

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '10m')

      cy.saveProject()

      cy.contains('Test project')
      .closest('li')
      .should('contain', 'Jane Johnson')
      .confirmStageOrder([
        'Company'
      ])
      .should('contain', '10m')
      .listRowNavigate('Interviews')

      cy.addProjectCandidate('Tom', 'tom@foobar.net')

      cy.contains('Start interview').click()

      cy.get('#language-choose-modal').find('button').contains('Choose').click()

      cy.get('[data-test-id="feature-form"]').eq(0)
        .should('contain', 'Company')
        .should('contain', '10m')
        .should('contain', LOREM_IPSUM)
        .within(() => {
          cy.contains('Other documents').closest('div').get('ul')
            .within(() => {
              cy.get('li').should('contain', 'info.pdf')
              cy.get('li').should('contain', 'File A.pdf')
              cy.get('li').should('contain', 'File B.pdf')
              cy.get('li').should('contain', 'File C.pdf')
            })

          cy.get('img[src*="office-500.jpg"]').should('exist')
        })

      cy.contains('Process overview')
        .closest('div[data-test-id="interview-process-overview"]')
        .within(() => {
          cy.contains('Questions').closest('div')
            .should('contain', 0)

          cy.get('ul')
            .within(() => {
              cy.get('li').eq(0)
                .should('contain', 'In progress')
                .should('contain', 'Company')
            })
          })
    })

    it('salary', () => {
      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Salary', 10)

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Salary')
        .should('contain', '10m')
        .should('have.attr', 'data-error', '0')

        cy.get('[data-test-id="feature-form"]')
          .should('contain', 'Salary')
          .should('contain', '10m')
          .within(() => {
            cy.contains('Budget range')
              .closest('div')
              .within(() => {
                cy.get('input[name="min"]')
                .should('have.value', 0)
                .type('{selectAll}{backspace}1000')

                cy.get('input[name="max"]')
                  .should('have.value', 4000)
                  .type('{selectAll}{backspace}5000')
              })

            cy.contains('Notes to interviewer')
              .closest('div')
              .findHtmlInputAndType('This is important information for interviewer.')
          })


      cy.contains('Total time:')
      .closest('div')
      .should('contain', '10m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Salary'
        ])
        .should('contain', '10m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', '1000 - 5000')
      .within(() => {
        cy.get('h2').should('contain', 'Salary')

        cy.get('input[name="min"]')
          .should('have.attr', 'placeholder', '1000')
          .type('{selectAll}{backspace}2000')

        cy.get('input[name="max"]')
          .should('not.exist')

        cy.get('input[type="checkbox"]')
          .click()

        cy.get('input[name="max"]')
          .should('have.attr', 'placeholder', '5000')
          .type('{selectAll}{backspace}4000')
      })

      cy.contains('Complete interview').click()
    })

    it('candidate-questions', () => {
      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Candidate', 10)


      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Candidate')
        .should('contain', '10m')
        .should('have.attr', 'data-error', '0')

        cy.get('[data-test-id="feature-form"]')
          .should('contain', 'Candidate questions')
          .should('contain', '10m')
          .should('contain', 'Remember to ask candidates if they have some questions.')
          .within(() => {
            cy.contains('Notes to interviewer')
              .closest('div')
              .findHtmlInputAndType('This is important information for interviewer.')
          })

        cy.contains('Total time:')
          .closest('div')
          .should('contain', '10m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Candidate'
        ])
        .should('contain', '10m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'Candidate questions')
      .should('contain', 'This is important information for interviewer.')
      .findHtmlInputAndType('This is important notes about candidate.')

      cy.contains('Complete interview').click()
    })

    it('other-questions', () => {
      cy.createOtherTextQuestion({ name: 'AAA?', desc: 'AAA!' })
      cy.createOtherTextQuestion({ name: 'BBB?', desc: 'BBB!' })
      cy.createOtherTextQuestion({ name: 'CCC?', desc: 'CCC!' })

      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Other')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Other')
        .should('contain', '5m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Other questions')
        .should('contain', '5m')
        .within(() => {
          cy.contains('AAA?').closest('li').should('contain', 'Text').find('button').click()
          cy.root().should('contain', '5m')
          cy.contains('BBB?').closest('li').should('contain', 'Text').find('button').click()
          cy.root().should('contain', '10m')
          cy.contains('CCC').closest('li').should('contain', 'Text').find('button').click()
          cy.root().should('contain', '15m')

          cy.contains('Selected questions').closest('div')
            .within(() => {
              cy.get('li').eq(0).should('contain', 'AAA').contains('5m').click()
              cy.get('input').type('{selectAll}1{enter}')
              cy.get('li').eq(1).should('contain', 'BBB').contains('5m').click()
              cy.get('input').type('{selectAll}2{enter}')
              cy.get('li').eq(2).should('contain', 'CCC').contains('5m').click()
              cy.get('input').type('{selectAll}3{enter}')
            })
        })
        .should('contain', '6m')

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '6m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Other'
        ])
        .should('contain', '6m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .within(() => {
        cy.get('[data-test-id="other-question-int"]').eq(0)
          .should('contain', 'AAA?')
          .should('contain', 'AAA!')
          .findHtmlInputAndType('AAA.')

        cy.get('[data-test-id="other-question-int"]').eq(1)
          .should('contain', 'BBB?')
          .should('contain', 'BBB!')
          .findHtmlInputAndType('BBB.')

        cy.get('[data-test-id="other-question-int"]').eq(2)
          .should('contain', 'CCC?')
          .should('contain', 'CCC!')
          .findHtmlInputAndType('CCC.')
      })

      cy.contains('Complete interview').click()
    })

    it('competency-questions', () => {
      cy.createCompetencyQuestion({ name: 'Are you familiar with ISO-111-A?', criteria: { name: 'ISO111'} });
      cy.createCompetencyQuestion({ name: 'Are you familiar with ISO-111-B?', criteria: { name: 'ISO111', create: false } });
      cy.createCompetencyQuestion({ name: 'Are you familiar with ISO-222?', criteria: { name: 'ISO222'} });

      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Competency')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Competency')
        .should('contain', '5m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Competency')
        .should('contain', '5m')
        .within(() => {
          cy.contains('Are you familiar with ISO-111-A?').closest('li').should('contain', 'ISO111').find('button').click()
          cy.root().should('contain', '5m')
          cy.contains('Are you familiar with ISO-111-B?').closest('li').should('contain', 'ISO111').find('button').click()
          cy.root().should('contain', '10m')
          cy.contains('Are you familiar with ISO-222?').closest('li').should('contain', 'ISO222').find('button').click()
          cy.root().should('contain', '15m')

          cy.contains('Selected questions').closest('div')
            .within(() => {
              cy.get('li').eq(0).should('contain', 'Are you familiar with ISO-111-A?').contains('5m').click()
              cy.get('input').type('{selectAll}1{enter}')
              cy.get('li').eq(1).should('contain', 'Are you familiar with ISO-111-B?').contains('5m').click()
              cy.get('input').type('{selectAll}2{enter}')
              cy.get('li').eq(2).should('contain', 'Are you familiar with ISO-222?').contains('5m').click()
              cy.get('input').type('{selectAll}3{enter}')
            })
        })
        .should('contain', '6m')

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '6m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Competency'
        ])
        .should('contain', '6m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'Are you familiar with ISO-111-A?')
      .findHtmlInputAndType('Yes ISO-111-A')

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'Are you familiar with ISO-111-B?')
      .findHtmlInputAndType('Yes ISO-111-B')

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'Are you familiar with ISO-222?')
      .findHtmlInputAndType('No ISO-222')

      cy.contains('Complete interview').click()
  })

    it('experience-questions', () => {
      cy.createExperienceQuestion({ name: 'E1A?', criteria: { name: 'E-1'} });
      cy.createExperienceQuestion({ name: 'E1B?', criteria: { name: 'E-1', create: false } });
      cy.createExperienceQuestion({ name: 'E2?', criteria: { name: 'E-2'} });

      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Experience')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Experience')
        .should('contain', '5m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Experience')
        .should('contain', '5m')
        .within(() => {
          cy.contains('E1A?').closest('li').should('contain', 'E-1').find('button').click()
          cy.root().should('contain', '5m')
          cy.contains('E1B?').closest('li').should('contain', 'E-1').find('button').click()
          cy.root().should('contain', '10m')
          cy.contains('E2?').closest('li').should('contain', 'E-2').find('button').click()
          cy.root().should('contain', '15m')

          cy.contains('Selected questions').closest('div')
            .within(() => {
              cy.get('li').eq(0).should('contain', 'E1A?').contains('5m').click()
              cy.get('input').type('{selectAll}1{enter}')
              cy.get('li').eq(1).should('contain', 'E1B?').contains('5m').click()
              cy.get('input').type('{selectAll}2{enter}')
              cy.get('li').eq(2).should('contain', 'E2?').contains('5m').click()
              cy.get('input').type('{selectAll}3{enter}')
            })
        })
        .should('contain', '6m')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', '6m')

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '6m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Experience'
        ])
        .should('contain', '6m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'E1A?')
      .findHtmlInputAndType('Yes E1A')

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'E1B?')
      .findHtmlInputAndType('Yes E1B')

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'E2?')
      .findHtmlInputAndType('No E2')

      cy.contains('Complete interview').click()
    })


    it('hard-skill-questions', () => {
      cy.createHardSkillQuestion({ name: 'HS1A?', criteria: { name: 'HS-1'} });
      cy.createHardSkillQuestion({ name: 'HS1B?', criteria: { name: 'HS-1', create: false } });
      cy.createHardSkillQuestion({ name: 'HS2?', criteria: { name: 'HS-2'} });

      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Hard skill')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Hard skill')
        .should('contain', '5m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Hard skill')
        .should('contain', '5m')
        .within(() => {
          cy.contains('HS1A?').closest('li').should('contain', 'HS-1').find('button').click()
          cy.root().should('contain', '5m')
          cy.contains('HS1B?').closest('li').should('contain', 'HS-1').find('button').click()
          cy.root().should('contain', '10m')
          cy.contains('HS2?').closest('li').should('contain', 'HS-2').find('button').click()
          cy.root().should('contain', '15m')

          cy.contains('Selected questions').closest('div')
            .within(() => {
              cy.get('li').eq(0).should('contain', 'HS1A?').contains('5m').click()
              cy.get('input').type('{selectAll}1{enter}')
              cy.get('li').eq(1).should('contain', 'HS1B?').contains('5m').click()
              cy.get('input').type('{selectAll}2{enter}')
              cy.get('li').eq(2).should('contain', 'HS2?').contains('5m').click()
              cy.get('input').type('{selectAll}3{enter}')
            })
        })
        .should('contain', '6m')

        cy.contains('Total time:')
        .closest('div')
        .should('contain', '6m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Hard skill'
        ])
        .should('contain', '6m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'HS1A?')
      .findHtmlInputAndType('Yes HS1A')

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'HS1B?')
      .findHtmlInputAndType('Yes HS1B')

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'HS2?')
      .findHtmlInputAndType('No HS2')

      cy.contains('Complete interview').click()
    })

    it('culture-questions', () => {
      cy.createCultureQuestion({ name: 'C1?' });
      cy.createCultureQuestion({ name: 'C2?' });
      cy.createCultureQuestion({ name: 'C3?' });

      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Culture')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Culture')
        .should('contain', '5m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Culture')
        .should('contain', '5m')
        .within(() => {
          cy.contains('C1?').closest('li').find('button').click()
          cy.root().should('contain', '5m')
          cy.contains('C2?').closest('li').find('button').click()
          cy.root().should('contain', '10m')
          cy.contains('C3?').closest('li').find('button').click()
          cy.root().should('contain', '15m')

          cy.contains('Selected questions').closest('div')
            .within(() => {
              cy.get('li').eq(0).should('contain', 'C1?').contains('5m').click()
              cy.get('input').type('{selectAll}1{enter}')
              cy.get('li').eq(1).should('contain', 'C2?').contains('5m').click()
              cy.get('input').type('{selectAll}2{enter}')
              cy.get('li').eq(2).should('contain', 'C3?').contains('5m').click()
              cy.get('input').type('{selectAll}3{enter}')
            })
        })
        .should('contain', '6m')

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '6m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Culture'
        ])
        .should('contain', '6m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'C1?')
      .findHtmlInputAndType('Yes C1')

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'C2?')
      .findHtmlInputAndType('Yes C2')

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'C3?')
      .findHtmlInputAndType('No C3')

      cy.contains('Complete interview').click()
    })

    it('motivation-questions', () => {
      cy.createMotivationQuestion({ name: 'M1?' });
      cy.createMotivationQuestion({ name: 'M2?' });
      cy.createMotivationQuestion({ name: 'M3?' });

      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Motivation')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Motivation')
        .should('contain', '5m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Motivation')
        .should('contain', '5m')
        .within(() => {
          cy.contains('M1?').closest('li').find('button').click()
          cy.root().should('contain', '5m')
          cy.contains('M2?').closest('li').find('button').click()
          cy.root().should('contain', '10m')
          cy.contains('M3?').closest('li').find('button').click()
          cy.root().should('contain', '15m')

          cy.contains('Selected questions').closest('div')
            .within(() => {
              cy.get('li').eq(0).should('contain', 'M1?').contains('5m').click()
              cy.get('input').type('{selectAll}1{enter}')
              cy.get('li').eq(1).should('contain', 'M2?').contains('5m').click()
              cy.get('input').type('{selectAll}2{enter}')
              cy.get('li').eq(2).should('contain', 'M3?').contains('5m').click()
              cy.get('input').type('{selectAll}3{enter}')
            })
        })
        .should('contain', '6m')

      cy.contains('Total time:')
        .closest('div')
        .should('contain', '6m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Motivation'
        ])
        .should('contain', '6m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .should('contain', 'M1?')
      .findHtmlInputAndType('Yes M1')

    cy.get('[data-test-id="feature-form"]').eq(1)
      .should('contain', 'M2?')
      .findHtmlInputAndType('Yes M2')

    cy.get('[data-test-id="feature-form"]').eq(2)
      .should('contain', 'M3?')
      .findHtmlInputAndType('No M3')

      cy.contains('Complete interview').click()
    })

    it('screening-questions', () => {
      cy.createScreeningChoiceQuestion({ name: 'Do you like fruits?', desc: 'Fruits fruits fruits.', choices: ['Yes', 'No'], multichoice: false });
      cy.createScreeningChoiceQuestion({ name: 'What music do you like?', desc: 'Music music music.', choices: ['Pop', 'Rock', 'Blues', 'Jazz'], multichoice: true });
      cy.createScreeningRangeQuestion({ name: 'How deep is Atlantic Ocean?', desc: 'Ocean ocean ocean.', min: 100, max: 20000, unit: 'm', step: 100 });

      cy.createEmptyProject('Test project')

      cy.contains('Test project').closest('li').listRowNavigate('Edit')

      cy.addStage('Screening')

      cy.get('[data-test-id="stage-tree-leaf"]')
        .should('contain', 'Screening')
        .should('contain', '5m')
        .should('have.attr', 'data-error', '0')

      cy.get('[data-test-id="feature-form"]')
        .should('contain', 'Screening')
        .should('contain', '5m')
        .within(() => {
          cy.contains('Do you like fruits?').closest('li').should('contain', 'Yes/No').find('button').click()
          cy.root().should('contain', '5m')
          cy.contains('What music do you like?').closest('li').should('contain', 'Multiple choice').find('button').click()
          cy.root().should('contain', '10m')
          cy.contains('How deep is Atlantic Ocean?').closest('li').should('contain', 'Range').find('button').click()
          cy.root().should('contain', '15m')

          cy.contains('Selected questions').closest('div')
            .within(() => {
              cy.get('li').eq(0).should('contain', 'Do you like fruits?').should('contain', 'Yes/No').contains('5m').click()
              cy.get('input').type('{selectAll}1{enter}')
              cy.get('li').eq(1).should('contain', 'What music do you like?').should('contain', 'Multiple choice').contains('5m').click()
              cy.get('input').type('{selectAll}2{enter}')
              cy.get('li').eq(2).should('contain', 'How deep is Atlantic Ocean?').should('contain', 'Range').contains('5m').click()
              cy.get('input').type('{selectAll}3{enter}')
            })
        })
        .should('contain', '6m')

        cy.contains('Total time:')
        .closest('div')
        .should('contain', '6m')

      cy.saveProject()

      cy.contains('Test project')
        .closest('li')
        .should('contain', 'Jane Johnson')
        .confirmStageOrder([
          'Screening'
        ])
        .should('contain', '6m')
        .listRowNavigate('Interviews')


    cy.addProjectCandidate('Tom', 'tom@foobar.net')

    cy.contains('Start interview').click()

    cy.get('#language-choose-modal').find('button').contains('Choose').click()

    cy.get('[data-test-id="feature-form"]').eq(0)
      .within(() => {
        cy.get('[data-test-id="screening-question-int"]').eq(0)
          .should('contain', 'Do you like fruits?')
          .should('contain', 'Fruits fruits fruits.')
          .find('[data-test-id="question-answers"]')
          .within(() => {
            cy.get('li').eq(0)
              .should('contain', 'Yes')
              .find('input[type="radio"]')
              .click()

            cy.get('li').eq(1)
              .should('contain', 'No')
              .find('input[type="radio"]')
          })

        cy.get('[data-test-id="screening-question-int"]').eq(1)
          .should('contain', 'What music do you like?')
          .should('contain', 'Music music music.')
          .find('[data-test-id="question-answers"]')
          .within(() => {
            cy.get('li').eq(0)
                .should('contain', 'Pop')
                .find('input[type="checkbox"]')
                .check()

              cy.get('li').eq(1)
                .should('contain', 'Rock')
                .find('input[type="checkbox"]')
                .check()

              cy.get('li').eq(2)
                .should('contain', 'Blues')
                .find('input[type="checkbox"]')
                .check()

              cy.get('li').eq(3)
                .should('contain', 'Jazz')
                .find('input[type="checkbox"]')
                .check()
          })

        cy.get('[data-test-id="screening-question-int"]').eq(2)
          .should('contain', 'How deep is Atlantic Ocean?')
          .should('contain', 'Ocean ocean ocean.')
          .should('contain', '100 m')
          .should('contain', '10000 m')
      })

      cy.contains('Complete interview').click()
    })
  })
