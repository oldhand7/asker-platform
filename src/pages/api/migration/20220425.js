

import { createApiHandler as getHandler } from 'libs/nc';
import { getAuth } from 'firebase-admin/auth'
import { saveCollectionDocument, getManyFromCollection } from 'libs/firestore-admin';

const handler = getHandler();

const migrate = () => {
  return getManyFromCollection('questions')
    .then(async questions => {

      await Promise.all(questions.map(q => {
        if (q.criteria && q.criteria.type) {
          q.type = 'evaluation';
          q.subtype = q.criteria.type
        }

        return saveCollectionDocument('questions', q)
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
