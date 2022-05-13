import { createApiHandler as getHandler } from 'libs/nc';
import { saveCollectionDocument, filterManyDocuments } from 'libs/firestore-admin';
import { calcDefaultScoringRules } from 'libs/project';

const handler = getHandler();

const migrate = async () => {
  await filterManyDocuments('projects')
    .then(async projects => {

      await Promise.all(projects.map(p => {
        if (p.scoringRules) {
          return Promise.resolve()
        }

        p.scoringRules = calcDefaultScoringRules(p);

        return saveCollectionDocument('projects', p)
      }))
    })

  await filterManyDocuments('templates')
    .then(async templates => {

      await Promise.all(templates.map(t => {
        if (t.scoringRules) {
          return Promise.resolve()
        }

        t.scoringRules = calcDefaultScoringRules(t);

        return saveCollectionDocument('templates', t)
      }))
    })
}

handler.get(async (req, res) => {
  try {
    await migrate()

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default handler;
