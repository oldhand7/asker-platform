const helpers = require('./helpers');

const beforeRun = async () => {
  await helpers.removeAllFirebaseUsers()
  await helpers.deleteCollection('projects');
  await helpers.deleteCollection('interviews');
  await helpers.deleteCollection('questions');
  await helpers.deleteCollection('templates');
  await helpers.deleteCollection('criteriaOptions');
  await helpers.deleteCollection('translations');
  await helpers.deleteCollection('companies');
  await helpers.deleteCollection('configTemplates');

  await (() => new Promise(resolve => setTimeout(resolve, 5000)))()

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

  //User 9
  const companyId9 = await helpers.createCompany('Rogers & Co')

  const userId9Joe  = await helpers.createUser('Joe Rogers', 'joe.rogers@example.com', 'test123', companyId9, 'admin', false)
  const userId9Jane = await helpers.createUser('Jane Rogers', 'jane.rogers@example.com', 'test123', companyId9, 'hr', false)

  //User 10
  const companyId10 = await helpers.createCompany('Kirby & Co')

  const userId10Joe  = await helpers.createUser('Joe Kirby', 'joe.kirby@example.com', 'test123', companyId10, 'admin', false)
  const userId10Jane = await helpers.createUser('Jane Kirby', 'jane.kirby@example.com', 'test123', companyId10, 'hr', false)

  //User 11
  const companyId11 = await helpers.createCompany('Arnolds & Co')

  const userId11Joe  = await helpers.createUser('Joe Arnolds', 'joe.arnolds@example.com', 'test123', companyId11, 'admin', false)
  const userId11Jane = await helpers.createUser('Jane Arnolds', 'jane.arnolds@example.com', 'test123', companyId11, 'hr', false)

  //User 12
  const companyId12 = await helpers.createCompany('Stevens & Co')

  const userId12Joe  = await helpers.createUser('Joe Stevens', 'joe.stevens@example.com', 'test123', companyId12, 'admin', false)
  const userId12Jane = await helpers.createUser('Jane Stevens', 'jane.stevens@example.com', 'test123', companyId12, 'hr', false)

  //User 13
  const companyId13 = await helpers.createCompany('Kaunas & Co')

  const userId13Joe  = await helpers.createUser('Joe Kaunas', 'joe.kaunas@example.com', 'test123', companyId13, 'admin', false)
  const userId13Jane = await helpers.createUser('Jane Kaunas', 'jane.kaunas@example.com', 'test123', companyId13, 'hr', false)

  //User 14
  const companyId14 = await helpers.createCompany('Barbara & Co')

  const userId14Joe  = await helpers.createUser('Joe Barbara', 'joe.barbara@example.com', 'test123', companyId14, 'admin', false)
  const userId14Jane = await helpers.createUser('Jane Barbara', 'jane.barbara@example.com', 'test123', companyId14, 'hr', false)

  //User 15
  const companyId15 = await helpers.createCompany('Johnson & Co')

  const userId15Joe  = await helpers.createUser('Joe Johnson', 'joe.johnson@example.com', 'test123', companyId15, 'admin', false)
  const userId15Jane = await helpers.createUser('Jane Johnson', 'jane.johnson@example.com', 'test123', companyId15, 'hr', false)

  //User 16
  const companyId16 = await helpers.createCompany('Gooney & Co')

  const userId16Joe  = await helpers.createUser('Joe Gooney', 'joe.gooney@example.com', 'test123', companyId16, 'admin', false)
  const userId16Jane = await helpers.createUser('Jane Gooney', 'jane.gooney@example.com', 'test123', companyId16, 'hr', false)

  //User 17
  const companyId17 = await helpers.createCompany('Goofey & Co')

  const userId17Joe  = await helpers.createUser('Joe Goofey', 'joe.goofey@example.com', 'test123', companyId17, 'admin', false)
  const userId17Jane = await helpers.createUser('Jane Goofey', 'jane.goofey@example.com', 'test123', companyId17, 'hr', false)

  //User 18
  const companyId18 = await helpers.createCompany('Riley & Co')

  const userId18Joe  = await helpers.createUser('Joe Riley', 'joe.riley@example.com', 'test123', companyId18, 'admin', false)
  const userId18Jane = await helpers.createUser('Jane Riley', 'jane.riley@example.com', 'test123', companyId18, 'hr', false)
  
  //User 19
  const companyId19 = await helpers.createCompany('Woodkid & Co')

  const userId19Joe  = await helpers.createUser('Joe Woodkid', 'joe.woodkid@example.com', 'test123', companyId19, 'admin', true)
  const userId19Jane = await helpers.createUser('Jane Woodkid', 'jane.woodkid@example.com', 'test123', companyId19, 'hr', false)

  //User 20
  const companyId20 = await helpers.createCompany('Lubeck & Co')

  const userId20Joe  = await helpers.createUser('Joe Woodkid', 'joe.lubeck@example.com', 'test123', companyId20, 'admin', true)
  const userId20Jane = await helpers.createUser('Jane Woodkid', 'jane.lubeck@example.com', 'test123', companyId20, 'hr', false)

  //User 21
  const companyId21 = await helpers.createCompany('Pink & Co')

  const userId21Joe  = await helpers.createUser('Joe Pink', 'joe.pink@example.com', 'test123', companyId21, 'admin', true)
  const userId21Jane = await helpers.createUser('Jane Pink', 'jane.pink@example.com', 'test123', companyId21, 'hr', false)

   //User 22
  const companyId22 = await helpers.createCompany('Foster & Co')

  const userId22Joe  = await helpers.createUser('Joe Woodkid', 'joe.foster@example.com', 'test123', companyId22, 'admin', true)
  const userId22Jane = await helpers.createUser('Jane Woodkid', 'jane.foster@example.com', 'test123', companyId22, 'hr', false)

  await (() => new Promise(resolve => setTimeout(resolve, 5000)))()
}

module.exports = {
  beforeRun
}
