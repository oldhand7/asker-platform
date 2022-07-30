import {
    createApiHandler as getHandler
  } from 'libs/nc';
  import {
    saveCollectionDocument,
    filterManyDocuments
  } from 'libs/firestore-admin';
  import {
    calcDefaultScoringRules
  } from 'libs/project';
  const {
    Timestamp
  } = require('firebase-admin/firestore');
  
  const handler = getHandler();
  
  const migrate = async () => {
    await filterManyDocuments('criteriaOptions')
      .then(async criteriaOptions => {
  
        await Promise.all(criteriaOptions.map(option => {
          if (typeof option.name !== "object") {
            option.name = {
                en: option.name,
                se: option.name
            }
          }

          if (typeof option.desc !== "object") {
            option.desc = {
                en: option.desc || '',
                se: option.desc || ''
            }
          }
  
          if (typeof option.createdAt === 'number') {
            option.createdAt = Timestamp.fromMillis(option.createdAt * 1000)
          }
  
          return saveCollectionDocument('criteriaOptions', option)
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
  