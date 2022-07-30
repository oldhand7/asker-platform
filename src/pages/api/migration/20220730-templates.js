import {
    createApiHandler as getHandler
  } from 'libs/nc';
  import {
    saveCollectionDocument,
    filterManyDocuments,
    getSingleDocument
  } from 'libs/firestore-admin';
  import {
    calcDefaultScoringRules
  } from 'libs/project';
  const {
    Timestamp
  } = require('firebase-admin/firestore');
import { getStageKey } from 'libs/stage'
  
  const handler = getHandler();
  
  const migrate = async () => {
    await filterManyDocuments('templates')
      .then(async templates => {
  
        await Promise.all(templates.map(async template => {

          template.stages = template.stages.map(s => {
              s.id = s.id.replace('culture-fit', 'culture');
              
              return s;
          })

          if (template.scoringRules && typeof template.scoringRules['culture-fit'] !== 'undefined') {
            template.scoringRules['culture'] = template.scoringRules['culture-fit']
            delete template.scoringRules['culture-fit'];
          }
  
          if (typeof template.createdAt === 'number') {
            template.createdAt = Timestamp.fromMillis(template.createdAt * 1000)
          }
  
          return saveCollectionDocument('templates', template)
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
  