/*
Description: Sets initial company statistics.
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
const MGIRATION_TARGET = 'companies';
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
        const projects = await filterManyDocuments('projects', [['companyId', '==', record.id]])

        record.projectCount = projects.length;
        record.projectStageCount = projects.reduce((sum, p) => sum + p.stages.length, 0);
        record.projectInterviewCount = projects.reduce((sum, p) => sum + p.interviewCount, 0);
        record.projectInterviewAwaitingCount = projects.reduce((sum, p) => sum + p.interviewAwaitingCount, 0);
        record.projectInterviewCompleteScoreSum = projects.reduce((sum, p) => sum + p.interviewCompleteScoreSum, 0);

        const templates = await filterManyDocuments('templates', [['companyId', '==', record.id]])

        record.templateCount = templates.length;

        const users = await filterManyDocuments('users', [['companyId', '==', record.id]])

        record.userCount = users.length;

        const questions = await filterManyDocuments('questions', [['companyId', '==', record.id]])

        record.questionCount = questions.length;

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
