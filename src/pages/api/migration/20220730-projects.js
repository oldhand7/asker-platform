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
    await filterManyDocuments('projects')
      .then(async projects => {
  
        await Promise.all(projects.map(async project => {

          project.stages = project.stages.map(s => {
              s.id = s.id.replace('culture-fit', 'culture');
              
              return s;
          })

          if (project.scoringRules && typeof project.scoringRules['culture-fit'] !== 'undefined') {
            project.scoringRules['culture'] = project.scoringRules['culture-fit']
            delete project.scoringRules['culture-fit'];
          }
  
          if (typeof project.createdAt === 'number') {
            project.createdAt = Timestamp.fromMillis(project.createdAt * 1000)
          }
  
          return saveCollectionDocument('projects', project)
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
  