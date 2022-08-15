//@INFO: interview anonimization
import {
    createApiHandler as getHandler
  } from 'libs/nc';
  import {
    saveCollectionDocument,
    filterManyDocuments,
  } from 'libs/firestore-admin';
  const {
    Timestamp
  } = require('firebase-admin/firestore');
import { v4 as uuidv4 } from 'uuid';
  
  const handler = getHandler();
  
  const migrate = async () => {
    await filterManyDocuments('projects')
      .then(async projects => {
  
        await Promise.all(projects.map(async project => {

          project.stages = project.stages.filter(s => s && s.id != 'team-role-presentation').map(s => {
              s.uid = s.uid || uuidv4();

              s.config = s.config || {}
              s.note = s.notes;

              if (s.id == 'salary') {
                s.config = {
                  min: s.config.range && s.config.range[0] || 0,
                  max: s.config.range && s.config.range[1] || 0
                }
              }

              if (typeof s.time !== "undefined") {
                s.config.time = s.time;
              }

              if (!s.config.time) {
                s.config.time = 5;
              }
              
              return s;
          })

          delete project.config;

          if (typeof project.createdAt === 'number') {
            project.createdAt = Timestamp.fromMillis(project.createdAt * 1000)
          }
  
          return saveCollectionDocument('projects', project)
        }))
      })

    await filterManyDocuments('templates')
      .then(async templates => {
  
        await Promise.all(templates.map(async template => {

          template.stages = template.stages.filter(s => s && s.id != 'team-role-presentation').map(s => {
              s.uid = s.uid || uuidv4();

              s.config = s.config || {}
              s.note = s.notes;

              if (s.id == 'salary') {
                s.config = {
                  min: s.config.range && s.config.range[0] || 0,
                  max: s.config.range && s.config.range[1] || 0,
                  time: 5
                }
              }

              if (typeof s.time !== "undefined") {
                s.config.time = s.time;
              }

              if (!s.config.time) {
                s.config.time = 5;
              }
              
              return s;
          })

          template.name = template.templateName;

          delete template.config;

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
  