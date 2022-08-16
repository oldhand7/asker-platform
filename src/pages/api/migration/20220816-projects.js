/* Removal of team role presentation */
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
    await filterManyDocuments('projects')
      .then(async projects => {
  
        await Promise.all(projects.map(async project => {

          project.stages = project.stages.filter(s => {
              return s.id != 'team-role-presentation';
          })

          project.stageCount = project.stages.length;

          if (typeof project.createdAt === 'number') {
            project.createdAt = Timestamp.fromMillis(project.createdAt * 1000)
          }
  
          return saveCollectionDocument('projects', project)
        }))
      })

      await filterManyDocuments('templates')
      .then(async templates => {
  
        await Promise.all(templates.map(async template => {

            template.stages = template.stages.filter(s => {
              return s.id != 'team-role-presentation';
          })

          template.stageCount = template.stages.length;

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
  