//@INFO:anonimization of candidates
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
import { v4 as uuidv4 } from 'uuid';
import { getRandomAlias} from 'libs/candidate';

  const handler = getHandler();

  const migrate = async () => {
    await filterManyDocuments('interviews')
      .then(async interviews => {

        const exclude = {};

        await Promise.all(interviews.map(async interview => {
          interview.score = interview.score || 0;

          if (interview.candidate) {
            if (!exclude[interview.projectId]) {
              exclude[interview.projectId] = [];
            }

            const alias = getRandomAlias(exclude[interview.projectId])

            interview.candidate.alias = alias

            exclude[interview.projectId].push(alias);
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
