/*
Description: Normalizes project statistics names.
*/

import {
    createApiHandler as getHandler
  } from 'libs/nc';
  import {
    saveCollectionDocument,
    filterManyDocuments,
    filterSingleDocument
  } from 'libs/firestore-admin';
  const {
    Timestamp
  } = require('firebase-admin/firestore');
import path from 'path'

const MGIRATION_ID =  path.basename(__filename, '.js');
const MGIRATION_TARGET = 'projects';
const MIGRATION_CARD = {
  name: MGIRATION_ID,
  createdAt: Timestamp.fromDate(new Date())
}
  
  const handler = getHandler();
  
  const migrate = async () => {

    await filterManyDocuments(MGIRATION_TARGET)
      .then(async records => {
        await Promise.all(records.map(async record => {
          // Start
          record.interviewCount = record.interviewsCount || 0;
          record.interviewAwaitingCount = record.interviewsAwaitingCount || 0;
          record.interviewerCount = record.interviewersCount || 0;

          const interviews = await filterManyDocuments('interviews', [['projectId', '==', record.id]])

          record.interviewCompleteScoreSum = interviews.filter(i => i.status == 'complete').reduce((sum, i) => sum + i.score, 0)

          // End
          if (typeof record.createdAt === 'number') {
            record.createdAt = Timestamp.fromMillis(record.createdAt * 1000)
          }

          if (!record.migrations) {
            record.migrations = []
          }

          record.migrations.push(MGIRATION_ID)
  
          return saveCollectionDocument(MGIRATION_TARGET, record)
        }))
      })
  }
  
  handler.get(async (req, res) => {
    try {
      const migration = await filterSingleDocument('migrations', [['name', '==', MGIRATION_ID]])

      if (!migration) {
        await migrate()
      } else {
        throw new Error("Migration already exists.")
      }

      await saveCollectionDocument('migrations', MIGRATION_CARD)
  
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
  