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
import { DEFAULT_QUESTION_TIME, DEFAULT_STAGE_TIME } from 'libs/config';
  
  const handler = getHandler();
  
  const migrate = async () => {
    await filterManyDocuments('projects')
      .then(async projects => {
  
        await Promise.all(projects.map(async p => {
          p.stages = p.stages || [];

          let time = 0;
          let config = {};

          for (let i = 0; i < (p.stages || []).length; i++) {
            const stageId = getStageKey(p.stages[i]);
            let { config: stageConfig } = p.stages[i];

            if (stageConfig) {
              let stageTime = 0;

              if (stageConfig.questions) {
                let questionsTimetable = {}

                for (let i = 0; i < stageConfig.questions.length; i++) {
                  const { id } = stageConfig.questions[i];

                  questionsTimetable[id] = DEFAULT_QUESTION_TIME;
                  stageTime += DEFAULT_QUESTION_TIME;
                }

                stageConfig.questionsTimetable = questionsTimetable;
              } else {
                stageTime = Number.parseInt(stageConfig.time || DEFAULT_STAGE_TIME);
              }

             stageConfig.time = stageTime || DEFAULT_STAGE_TIME;
            } else {
              stageConfig = {
                time: DEFAULT_STAGE_TIME
              }
            }

            time += stageConfig.time;
            config[stageId] = stageConfig;
          }

          //Not used anymore
          if (p.scoringRules && p.scoringRules['hard-skill']) {
            delete p.scoringRules['hard-skill']
          }

          p.time = time;
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
          t.stages = t.stages || [];

          let time = 0;
          let config = {};

          for (let i = 0; i < (t.stages || []).length; i++) {
            const stageId = getStageKey(t.stages[i]);
            let { config: stageConfig } = t.stages[i];

            if (stageConfig) {
              let stageTime = 0;

              if (stageConfig.questions) {
                let questionsTimetable = {}

                for (let i = 0; i < stageConfig.questions.length; i++) {
                  const { id } = stageConfig.questions[i];

                  questionsTimetable[id] = DEFAULT_QUESTION_TIME;
                  stageTime += DEFAULT_QUESTION_TIME;
                }

                stageConfig.questionsTimetable = questionsTimetable;
              } else {
                stageTime = Number.parseInt(stageConfig.time || DEFAULT_STAGE_TIME);
              }

             stageConfig.time = stageTime || DEFAULT_STAGE_TIME;
            } else {
              stageConfig = {
                time: DEFAULT_STAGE_TIME
              }
            }

            time += stageConfig.time;
            config[stageId] = stageConfig;
          }

          //Not used anymore
          if (t.scoringRules && t.scoringRules['hard-skill']) {
            delete t.scoringRules['hard-skill']
          }

          t.time = time;
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
  