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
import { v4 as uuidv4 } from 'uuid';

const handler = getHandler();

const TIME = 4;

const migrate = async () => {
  await filterManyDocuments('projects')
    .then(async projects => {

      await Promise.all(projects.map(async p => {
        p.stages = p.stages
          .filter(s => s)
          .map(s => {
            if (!s.uid) {
              s.uid = uuidv4()
            }

            s.time = TIME;

            return s;
          })

        p.time = p.stages.length * TIME;

        if (p.config) {
          for (const key in p.config) {
            const s = p.stages.find(s => s.id == key);

            if (s) {
              s.config = p.config[key]
            }
          }

          delete p.config;
        }

        p.scoringRules = {
          ...calcDefaultScoringRules(p),
          ...(p.scoringRules || {})
        }

        const projectInterviews = await filterManyDocuments('interviews', [
          ['projectId', '==', p.id]
        ])

        await Promise.all(projectInterviews.map(pint => {
          if (!pint.evaluations) {
            return Promise.resolve()
          }

          for (const key in pint.evaluations) {
            const s = p.stages.find(s => s.id == key);

            if (s) {
              pint.evaluations[`${s.id}_${s.uid}`] = pint.evaluations[key]
            }

            delete pint.evaluations[key]
          }

          return saveCollectionDocument('interviews', pint)
        }))

        return saveCollectionDocument('projects', p)
      }))
    })

  await filterManyDocuments('templates')
    .then(async projects => {
      await Promise.all(projects.map(p => {
        p.stages = p.stages
          .filter(s => s)
          .map(s => {
            if (!s.uid) {
              s.uid = uuidv4()
            }

            s.time = TIME;

            return s;
          })

        p.time = p.stages.length * TIME;

        if (p.config) {
          for (const key in p.config) {
            const s = p.stages.find(s => s.id == key);

            if (s) {
              s.config = p.config[key]
            }
          }

          delete p.config;
        }

        p.scoringRules = {
          ...calcDefaultScoringRules(p),
          ...(p.scoringRules || {})
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
