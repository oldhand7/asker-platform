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
  await filterManyDocuments('projects')
    .then(async projects => {

      await Promise.all(projects.map(p => {
        if (!p.config) {
          return Promise.resolve();
        }

        const questionsMap = {}

        const stageKeys = Object.keys(p.config);

        for (let i = 0; i < stageKeys.length; i++) {
          const key = stageKeys[i];

          if (p.config[key] && p.config[key].questions) {
            p.config[key].questions = p.config[key].questions.map(q => {
              questionsMap[q.id] = q;

              return q.id;
            })
          }
        }

        p.questionsMap = questionsMap;

        if (typeof p.createdAt === 'number') {
          p.createdAt = Timestamp.fromMillis(p.createdAt * 1000)
        }

        return saveCollectionDocument('projects', p)
      }))
    })

  await filterManyDocuments('templates')
    .then(async projects => {

      await Promise.all(projects.map(p => {
        if (!p.config) {
          return Promise.resolve();
        }

        const questionsMap = {}

        const stageKeys = Object.keys(p.config);

        for (let i = 0; i < stageKeys.length; i++) {
          const key = stageKeys[i];

          if (p.config[key] && p.config[key].questions) {
            p.config[key].questions = p.config[key].questions.map(q => {
              questionsMap[q.id] = q;

              return q.id;
            })
          }
        }

        p.questionsMap = questionsMap;

        if (typeof p.createdAt === 'number') {
          p.createdAt = Timestamp.fromMillis(p.createdAt * 1000)
        }

        return saveCollectionDocument('templates', p)
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
