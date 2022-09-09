  //@TODO: migrate stage configs to config
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
import { getStageKey } from 'libs/stage'
  
  const handler = getHandler();
  
  const migrate = async () => {
    await filterManyDocuments('projects')
      .then(async projects => {
  
        await Promise.all(projects.map(async p => {

          let config = {};

          if (p.stages) {
            for (let i = 0; i < p.stages.length; i++) {
              const stageId = getStageKey(p.stages[i]);
      
              config[stageId] = p.stages[i].config || null;
            }
          }
      
          p.config = config;
  
          if (typeof p.createdAt === 'number') {
            p.createdAt = Timestamp.fromMillis(p.createdAt * 1000)
          }
  
          return saveCollectionDocument('projects', p)
        }))
      })

    await filterManyDocuments('templates')
      .then(async templates => {
  
        await Promise.all(templates.map(async t => {

          let config = {};

          if (t.stages) {
            for (let i = 0; i < t.stages.length; i++) {
              const stageId = getStageKey(t.stages[i]);
      
              config[stageId] = t.stages[i].config || null;
            }
          }
      
          t.config = config;
  
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
  