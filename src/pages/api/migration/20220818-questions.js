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
    await filterManyDocuments('questions')
      .then(async questions => {
  
        await Promise.all(questions.map(question => {

          if (typeof question.desc == 'object' && typeof question.desc.en == 'object') {
            question.desc = {
              en: '',
              se: ''
            }
          }

          if (question.answers) {
            question.answers = question.answers.map(qa => {
                  if (typeof qa !== 'object') {
                      return {
                          uid: qa,
                          name: {
                              en: qa,
                              se: qa
                          }
                      }
                  }

                  return qa;
              })
          }

          if (typeof question.createdAt === 'number') {
            question.createdAt = Timestamp.fromMillis(question.createdAt * 1000)
          }
          
          return saveCollectionDocument('questions', question)
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
  