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
    await filterManyDocuments('questions')
      .then(async questions => {
  
        await Promise.all(questions.map(question => {
          if (typeof question.name !== "object") {
            question.name = {
                en: question.name,
                se: question.name
            }
          }

          if (question.criteria) {
            if (typeof question.criteria.name !== 'object') {
                question.criteria.name = {
                    en: question.criteria.name,
                    se: question.criteria.name
                }
            }

            if (typeof question.criteria.desc !== 'object') {
                question.criteria.desc = {
                    en: question.criteria.desc || '',
                    se: question.criteria.desc || ''
                }
            }

            question.criteriaId = question.criteria.id;
          }

          if (question.followup) {
            question.followup = question.followup.map(name => {
                if (typeof name !== 'object') {
                    return {
                        en: name,
                        se: name
                    }
                }
    
                return name;
            })
          }


          if (question.type == 'evaluation' && typeof question.note === "undefined") {
                question.note = {
                    en: question.desc || '',
                    se: question.desc || ''
                }

               question.desc = { en: '', se: '' }
           }


            if (question.type == 'screening' || question.type == 'other' && typeof question.desc !== "object") {
                question.desc = {
                    en: question.desc || '',
                    se: question.desc || ''
                }
            }


            if (question.rules) {
                question.rules = question.rules.map(rule => {
                    if (typeof rule.name !== 'object') {
                        rule.name = {
                            en: rule.name,
                            se: rule.name
                        }

                        if (!rule.steps) {
                            rule.steps = [];
                        }

                        rule.steps = rule.steps.map(step => {
                            if (typeof step !== 'object') {
                                return {
                                    en: step,
                                    se: step
                                }
                            }

                            return step;
                        })
                    }

                    return rule;
                })
            }
        
            if (question.answers) {
                question.answers.map(qa => {
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

            if (question.subtype == 'culture-fit') {
                question.subtype = 'culture';
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
  