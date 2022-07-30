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
    await filterManyDocuments('interviews')
      .then(async interviews => {
  
        await Promise.all(interviews.map(async interview => {

          if (interview.evaluations) {
            for (let key in interview.evaluations) {
              if (key.indexOf('culture-fit') > -1) {
                const newKey = key.replace('culture-fit', 'culture');

                interview.evaluations[newKey] = interview.evaluations[key]
                delete interview.evaluations[key];

                for (let k in interview.evaluations[newKey]) {
                  if (interview.evaluations[newKey][k].subtype && interview.evaluations[newKey][k].subtype == 'culture-fit') {
                    interview.evaluations[newKey][k].subtype = 'culture';
                  }
                }
              }
            }

            const project = await getSingleDocument('projects', interview.projectId)

            if (project) {
              for (let i = 0; i < project.stages.length; i++) {
                if (project.stages[i].id != 'screening-questions') {
                  continue;
                }
          
                const key = getStageKey(project.stages[i])
                
                if (interview.evaluations[key]) {
                  const { config } = project.stages[i];

                  for (const qid in interview.evaluations[key]) {
                    const question = config.questions.find(q => q.id == qid)
          
                    if (question) {
                      const { subtype } = question;

                      if (subtype == 'choice' || subtype == 'multichoice') {
                        interview.evaluations[key][qid] = interview.evaluations[key][qid].map(a => {
                          if (typeof a !== 'object') {
                            return {
                              uid: a,
                              name: {
                                en: a,
                                se: a
                              }
                            }
                          }

                          return a;
                        })
                      }
                    }
                  }
                }
              }
            }
          }
  
          if (typeof interview.createdAt === 'number') {
            interview.createdAt = Timestamp.fromMillis(interview.createdAt * 1000)
          }
  
          return saveCollectionDocument('interviews', interview)
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
  