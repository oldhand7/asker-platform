  import {
    createApiHandler as getHandler
  } from 'libs/nc';
  import {
    saveCollectionDocument,
    filterManyDocuments
  } from 'libs/firestore-admin';
  const {
    Timestamp
  } = require('firebase-admin/firestore');
  
  const handler = getHandler();
  
  const migrate = async () => {
    await filterManyDocuments('templates')
      .then(async templates => {
  
        await Promise.all(templates.map(async t => {

          t.name = t.name || t.templateName;

          if (typeof t.createdAt === 'number') {
            t.createdAt = Timestamp.fromMillis(t.createdAt * 1000)
          }
  
          return saveCollectionDocument('templates', t)
        }))
      })
  }
  
  handler.get(async (req, res) => {
    try {
      await migrate()
  
      res.status(200).json({
        success: true
      })
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  })
  
  export default handler;
  