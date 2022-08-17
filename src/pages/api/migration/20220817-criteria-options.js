/* Updates each of criteria options once. This triggers cloud functions. */
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
    await filterManyDocuments('criteriaOptions')
      .then(async criteriaOptions => {
  
        await Promise.all(criteriaOptions.map(async criteriaOption => {
          if (typeof criteriaOption.createdAt === 'number') {
            criteriaOption.createdAt = Timestamp.fromMillis(criteriaOption.createdAt * 1000)
          }

          criteriaOption.update = 'translation';
  
          return saveCollectionDocument('criteriaOptions', criteriaOption)
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
  