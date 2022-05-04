const helpers = require('./helpers');

const beforeRun = async () => {
  await helpers.removeAllFirebaseUsers()
  await helpers.deleteCollection('companies');
  await helpers.deleteCollection('projects');
  await helpers.deleteCollection('interviews');
  await helpers.deleteCollection('questions');
  await helpers.deleteCollection('templates');
  await helpers.deleteCollection('criteriaOptions');

  //Creates superadmin
  await helpers.createRootCompany()

  await helpers.createUser('John Powers', 'admin@askertech.com', 'test123', 'asker', 'admin', true)

  //User 1
  const companyId1 = await helpers.createCompany('Doe Paper Company')

  await helpers.createUser('Joe Doe', 'joe.doe@example.com', 'test123', companyId1, 'admin', false)
  await helpers.createUser('Jane Doe', 'jane.doe@example.com', 'test123', companyId1, 'hr', false)

  //User 2
  const companyId2 = await helpers.createCompany('Philips')

  const userId2Joe  = await helpers.createUser('Joe Philips', 'joe.philips@example.com', 'test123', companyId2, 'admin', false)
  const userId2Jane = await helpers.createUser('Jane Philips', 'jane.philips@example.com', 'test123', companyId2, 'hr', false)

  //User 3
  const companyId3 = await helpers.createCompany('Smith & Co')

  const userId3Joe  = await helpers.createUser('Joe Smith', 'joe.smith@example.com', 'test123', companyId3, 'admin', false)
  const userId3Jane = await helpers.createUser('Jane Smith', 'jane.smith@example.com', 'test123', companyId3, 'hr', false)

  //User 4
  const companyId4 = await helpers.createCompany('Brown & Co')

  const userId4Joe  = await helpers.createUser('Joe Brown', 'joe.brown@example.com', 'test123', companyId4, 'admin', false)
  const userId4Jane = await helpers.createUser('Jane Brown', 'jane.brown@example.com', 'test123', companyId4, 'hr', false)

  //User 5
  const companyId5 = await helpers.createCompany('Davis & Co')

  const userId5Joe  = await helpers.createUser('Joe Davis', 'joe.davis@example.com', 'test123', companyId5, 'admin', false)
  const userId5Jane = await helpers.createUser('Jane Davis', 'jane.davis@example.com', 'test123', companyId5, 'hr', false)

  //User 6
  const companyId6 = await helpers.createCompany('Miller & Co')

  const userId6Joe  = await helpers.createUser('Joe Miller', 'joe.miller@example.com', 'test123', companyId6, 'admin', false)
  const userId6Jane = await helpers.createUser('Jane Miller', 'jane.miller@example.com', 'test123', companyId6, 'hr', false)

  //User 7
  const companyId7 = await helpers.createCompany('Anderson & Co')

  const userId7Joe  = await helpers.createUser('Joe Anderson', 'joe.anderson@example.com', 'test123', companyId7, 'admin', false)
  const userId7Jane = await helpers.createUser('Jane Anderson', 'jane.anderson@example.com', 'test123', companyId7, 'hr', false)

  //User 8
  const companyId8 = await helpers.createCompany('Spencer & Co')

  const userId8Joe  = await helpers.createUser('Joe Spencer', 'joe.spencer@example.com', 'test123', companyId8, 'admin', false)
  const userId8Jane = await helpers.createUser('Jane Spencer', 'jane.spencer@example.com', 'test123', companyId8, 'hr', false)

  //User 8
  const companyId9 = await helpers.createCompany('Rogers & Co')

  const userId9Joe  = await helpers.createUser('Joe Rogers', 'joe.rogers@example.com', 'test123', companyId9, 'admin', false)
  const userId9Jane = await helpers.createUser('Jane Rogers', 'jane.rogers@example.com', 'test123', companyId9, 'hr', false)

  await helpers.createQuestion({
    name: 'CQ1',
    companyId: companyId2,
    criteria: {
      name: 'CA',
      type: 'competency'
    }
  })

  await helpers.createQuestion({
    name: 'CQ2',
    companyId: companyId2,
    criteria: {
      name: 'CB',
      type: 'competency'
    }
  })

  await helpers.createQuestion({
    name: 'CQ3',
    companyId: companyId2,
    criteria: {
      name: 'CC',
      type: 'competency'
    }
  })

  //allow some time to pass for propagation of claims
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const projectId = await helpers.createProject({
    companyId: companyId2,
    userId: userId2Joe,
    createdAt: 0,
    updatedAt: 0,
    name: 'Philips Demo Project',
    stages: [
      { id: 'introduction', name: 'Introduction', type: 'other' },
      { id: 'questions', name: 'Questions', type: 'other' },
      { id: 'summary', name: 'Summary', type: 'other' }
    ],
    config: {
      introduction: {
        text: 'This is Philips introduction.'
      }
    },
    interviewers: [
      { id: userId2Jane, name: 'Jane Philips'}
    ],
    template: {
      id: 'philips-engineer',
      name: 'Philips Engineer'
    },
    interviewsCount: 0,
    interviewsAwaitingCount: 0
  })

  await helpers.createInterview({
    companyId: companyId2,
    userId: userId2Joe,
    projectId: projectId,
    candidate: { id: 'ca', name: 'Candidate A' },
    score: 40,
    status: 'complete',
    evaluations: [],
    createdAt: 1,
    updatedAt: 0
  })

  await helpers.createInterview({
    companyId: companyId2,
    userId: userId2Joe,
    projectId: projectId,
    candidate: { id: 'cb', name: 'Candidate B' },
    status: 'awaiting',
    evaluations: [],
    createdAt: 2,
    updatedAt: 0,
  })
}

module.exports = {
  beforeRun
}
